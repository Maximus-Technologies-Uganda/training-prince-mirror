# Contract: GitHub Repository Settings API

**Status**: Reference  
**Purpose**: Document the GitHub API endpoint for repository settings (for potential future automation)  
**Implementation**: Manual UI (not automated)

---

## Endpoint: Update Repository Default Branch

```
PATCH /repos/{owner}/{repo}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| owner | string | Yes | Repository owner username (e.g., "prnceb") |
| repo | string | Yes | Repository name (e.g., "hello-world") |

### Request Body

```json
{
  "default_branch": "development"
}
```

### Response (Success - 200 OK)

```json
{
  "id": 123456789,
  "name": "hello-world",
  "full_name": "prnceb/hello-world",
  "default_branch": "development",
  "owner": {
    "login": "prnceb",
    "type": "User"
  },
  "updated_at": "2025-11-03T14:30:00Z",
  "pushed_at": "2025-11-03T14:30:00Z"
}
```

### Response (Error - 422 Unprocessable Entity)

```json
{
  "message": "Validation Failed",
  "errors": [
    {
      "message": "Invalid branch name",
      "resource": "Repository",
      "field": "default_branch",
      "code": "invalid"
    }
  ]
}
```

---

## Example Usage

### cURL Command
```bash
curl -X PATCH \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"default_branch":"development"}' \
  https://api.github.com/repos/prnceb/hello-world
```

### JavaScript (Node.js with @octokit/rest)
```javascript
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const result = await octokit.repos.update({
  owner: "prnceb",
  repo: "hello-world",
  default_branch: "development",
});

console.log("Default branch updated:", result.data.default_branch);
```

---

## Notes

### Current Implementation Decision
This feature uses **manual GitHub UI verification** instead of API automation:
- **Rationale**: One-time configuration change
- **Verification Method**: Screenshot documentation in PR description
- **Why not API**: Adds unnecessary complexity for infrequent operations; manual approach is more transparent and auditable for this team

### When to Use API (Future Enhancement)
If future features require automating default branch changes across multiple repositories or on a regular schedule, use the API endpoint documented above.

### Authentication
- **Required**: GitHub Personal Access Token or OAuth token
- **Scopes**: `repo` (full control of private repositories)
- **Rate Limits**: 5000 requests/hour (authenticated)

### Preconditions for Success
1. User/token has admin access to the repository
2. Target branch (`development`) exists in the repository
3. No branch protection rules block the operation
4. Repository is not archived

### Common Error Cases

| Error | Cause | Solution |
|-------|-------|----------|
| `404 Not Found` | Repository doesn't exist or insufficient permissions | Verify repository name and access |
| `422 Unprocessable Entity` | Invalid branch name or branch doesn't exist | Verify branch exists in repository |
| `403 Forbidden` | Insufficient permissions (not admin) | Contact repository owner |
| `451 Repository access blocked` | Repository access policy violation | Contact GitHub support |

---

## References

- [GitHub API v3: Repositories](https://docs.github.com/en/rest/reference/repos)
- [GitHub API v3: Update a repository](https://docs.github.com/en/rest/reference/repos#update-a-repository)
- [GitHub: Personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

**Last Updated**: 2025-11-03  
**Feature**: Week 4 Finisher: Default Branch Hygiene
