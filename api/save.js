export default async function handler(req, res) {
    // --- SETTINGS ---
    const OWNER = 'Priyanshu0sharma';
    const REPO = 'ROOT-OF-WEB';
    const BRANCH = 'main'; // Change if using a different default branch
    
    // --- CREDENTIALS ---
    const ADMIN_USER = 'priyanshusharma1131@gmail.com';
    const ADMIN_PASS = 'Zero9352286423@';
    
    const EDITOR_USER = 'rootofwebs@gmail.com';
    const EDITOR_PASS = 'RootOfWeb@24EARAD';

    const TOKEN = process.env.GITHUB_TOKEN;

    if (!TOKEN) {
        return res.status(500).json({ status: 'error', message: 'GITHUB_TOKEN environment variable is missing in Vercel' });
    }

    // --- HELPER FUNCTIONS ---
    async function getFileSha(path) {
        try {
            const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`, {
                headers: {
                    'Authorization': `token ${TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                return data.sha;
            }
            if (response.status === 404) return null; // File doesn't exist
            return null;
        } catch (e) {
            return null;
        }
    }

    async function commitFile(path, content, message, sha) {
        const body = {
            message: message,
            content: Buffer.from(content, 'utf8').toString('base64'),
            branch: BRANCH
        };
        if (sha) body.sha = sha;

        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to commit file to GitHub');
        }
        return await response.json();
    }

    async function deleteFile(path, message, sha) {
        if (!sha) return; // Nothing to delete
        const body = {
            message: message,
            sha: sha,
            branch: BRANCH
        };

        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to delete file on GitHub');
        }
    }


    // --- ROUTE HANDLING ---
    if (req.method === 'GET') {
        const action = req.query.action || '';
        const email = req.query.email || '';
        const password = req.query.password || '';

        if (action === 'check_draft' && email === ADMIN_USER && password === ADMIN_PASS) {
            const sha = await getFileSha('draft.html');
            return res.status(200).json({ status: 'success', has_draft: !!sha });
        }
        return res.status(401).json({ status: 'error', message: 'Unauthorized or invalid action' });
    }

    if (req.method === 'POST') {
        const { action, email, password, html_content } = req.body || {};
        const act = action || 'save_html';

        // Determine role
        let role = null;
        if (email === ADMIN_USER && password === ADMIN_PASS) {
            role = 'admin';
        } else if (email === EDITOR_USER && password === EDITOR_PASS) {
            role = 'editor';
        }

        if (!role) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        try {
            if (act === 'save_html') {
                if (!html_content) return res.status(400).json({ status: 'error', message: 'No HTML content provided' });
                
                let content = html_content;
                if (!content.toLowerCase().includes('<!doctype html>')) {
                    content = "<!DOCTYPE html>\n" + content;
                }

                if (role === 'admin') {
                    // Admin saves to index.html directly
                    const indexSha = await getFileSha('index.html');
                    await commitFile('index.html', content, 'Admin Live Edit: Updated index.html', indexSha);
                    
                    // Cleanup draft if it exists
                    const draftSha = await getFileSha('draft.html');
                    if (draftSha) {
                        await deleteFile('draft.html', 'Admin Live Edit: Auto-cleared draft.html', draftSha);
                    }
                    return res.status(200).json({ status: 'success', message: 'LIVE_SAVED' });
                } else {
                    // Editor saves to draft.html
                    const draftSha = await getFileSha('draft.html');
                    await commitFile('draft.html', content, 'Editor Draft: Updated draft.html', draftSha);
                    return res.status(200).json({ status: 'success', message: 'DRAFT_SAVED' });
                }
            }
            
            // Admin only actions
            if (role === 'admin') {
                if (act === 'approve_draft') {
                    const draftSha = await getFileSha('draft.html');
                    if (!draftSha) return res.status(404).json({ status: 'error', message: 'No pending draft found on GitHub' });

                    // Fetch the draft content from GitHub
                    const draftRes = await fetch(`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/draft.html`, {
                        headers: { 'Authorization': `token ${TOKEN}` }
                    });
                    
                    if (!draftRes.ok) return res.status(500).json({ status: 'error', message: 'Failed to read draft.html content' });
                    const draftContent = await draftRes.text();

                    // Commit draft content to index.html
                    const indexSha = await getFileSha('index.html');
                    await commitFile('index.html', draftContent, 'Admin Approved: Published draft to live site', indexSha);
                    
                    // Delete the draft
                    await deleteFile('draft.html', 'Admin Approved: Deleted processed draft.html', draftSha);
                    
                    return res.status(200).json({ status: 'success', message: 'Draft approved and published' });
                } 
                else if (act === 'reject_draft') {
                    const draftSha = await getFileSha('draft.html');
                    if (!draftSha) return res.status(404).json({ status: 'error', message: 'No pending draft found on GitHub' });

                    await deleteFile('draft.html', 'Admin Rejected: Deleted draft.html', draftSha);
                    return res.status(200).json({ status: 'success', message: 'Draft rejected and deleted' });
                }
            }
            
            return res.status(400).json({ status: 'error', message: 'Invalid action or unauthorized' });

        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
}
