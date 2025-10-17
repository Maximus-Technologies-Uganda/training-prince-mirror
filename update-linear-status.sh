#!/bin/bash
# Update Linear Status for Completed Tasks using GitHub Secrets

echo "=== Updating Linear Status for Completed Tasks ==="

# Use GitHub secrets for Linear API
API_KEY="$LINEAR_API_KEY"
TEAM_NAME="Prince Training"
PROJECT_NAME="Training-Prince"
PARENT_ID="PRI-207"

if [ -z "$API_KEY" ]; then
    echo "❌ Error: LINEAR_API_KEY not available in GitHub secrets"
    exit 1
fi

echo "✅ Using Linear API key from GitHub secrets"
echo "✅ Team: $TEAM_NAME"
echo "✅ Project: $PROJECT_NAME"
echo "✅ Parent: $PARENT_ID"
echo ""

# Function to update Linear issue status
update_linear_status() {
    local task_id="$1"
    local status="$2"
    
    echo "Updating $task_id to $status..."
    
    # Get team ID
    TEAM_QUERY='query { teams(first: 200) { nodes { id name key } } }'
    TEAM_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: $API_KEY" \
        -d "{\"query\": \"$TEAM_QUERY\"}" \
        https://api.linear.app/graphql)
    
    TEAM_ID=$(echo "$TEAM_RESPONSE" | jq -r '.data.teams.nodes[] | select(.name == "Prince Training") | .id')
    
    if [ -z "$TEAM_ID" ]; then
        echo "❌ Could not find team ID"
        return 1
    fi
    
    # Get team states
    STATES_QUERY="query(\$teamId: String!) { team(id: \$teamId) { id states(first: 100) { nodes { id name type } } } }"
    STATES_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: $API_KEY" \
        -d "{\"query\": \"$STATES_QUERY\", \"variables\": {\"teamId\": \"$TEAM_ID\"}}" \
        https://api.linear.app/graphql)
    
    # Find "Done" state
    DONE_STATE_ID=$(echo "$STATES_RESPONSE" | jq -r '.data.team.states.nodes[] | select(.name == "Done" or .name == "done" or .name == "Completed" or .name == "completed") | .id' | head -1)
    
    if [ -z "$DONE_STATE_ID" ]; then
        echo "❌ Could not find 'Done' state"
        return 1
    fi
    
    # Find issue by title pattern
    ISSUE_QUERY="query(\$teamId: String!) { issues(first: 200, filter: { team: { id: { eq: \$teamId } } }) { nodes { id identifier title } } }"
    ISSUE_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: $API_KEY" \
        -d "{\"query\": \"$ISSUE_QUERY\", \"variables\": {\"teamId\": \"$TEAM_ID\"}}" \
        https://api.linear.app/graphql)
    
    # Find the specific task issue
    ISSUE_ID=$(echo "$ISSUE_RESPONSE" | jq -r ".data.issues.nodes[] | select(.title | contains(\"$task_id\")) | .id" | head -1)
    
    if [ -z "$ISSUE_ID" ]; then
        echo "❌ Could not find issue for $task_id"
        return 1
    fi
    
    # Update issue status
    UPDATE_MUTATION="mutation(\$id: String!, \$stateId: String!) { issueUpdate(id: \$id, input: { stateId: \$stateId }) { success } }"
    UPDATE_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: $API_KEY" \
        -d "{\"query\": \"$UPDATE_MUTATION\", \"variables\": {\"id\": \"$ISSUE_ID\", \"stateId\": \"$DONE_STATE_ID\"}}" \
        https://api.linear.app/graphql)
    
    SUCCESS=$(echo "$UPDATE_RESPONSE" | jq -r '.data.issueUpdate.success')
    
    if [ "$SUCCESS" = "true" ]; then
        echo "✅ Updated $task_id to Done"
    else
        echo "❌ Failed to update $task_id"
        echo "Response: $UPDATE_RESPONSE"
    fi
}

# Update completed tasks T001-T004
echo "Updating completed tasks from Phase 3.1..."
update_linear_status "T001" "Done"
update_linear_status "T002" "Done"
update_linear_status "T003" "Done"
update_linear_status "T004" "Done"

echo ""
echo "✅ Linear status updates completed!"
echo "Check your Linear workspace to see the updated statuses."
