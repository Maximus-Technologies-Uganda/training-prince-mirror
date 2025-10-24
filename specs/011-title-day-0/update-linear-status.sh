#!/bin/bash
# Update Linear Status for Completed Tasks

echo "=== Updating Linear Status for Completed Tasks ==="

# Check if Linear API key is available
if [ -z "${LINEAR_API_KEY:-}" ]; then
    echo "❌ Error: LINEAR_API_KEY environment variable not set"
    echo ""
    echo "To set it up:"
    echo "1. Go to Linear Settings → API"
    echo "2. Create a new API key"
    echo "3. Run: export LINEAR_API_KEY='your_api_key_here'"
    echo "4. Then run this script again"
    exit 1
fi

# Set required environment variables
export LINEAR_TEAM_NAME="Prince Training"
export LINEAR_PROJECT_NAME="Training-Prince"
export LINEAR_PARENT_IDENTIFIER="PRI-207"

echo "✅ Linear API key is set"
echo "✅ Team: $LINEAR_TEAM_NAME"
echo "✅ Project: $LINEAR_PROJECT_NAME"
echo "✅ Parent: $LINEAR_PARENT_IDENTIFIER"
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
        -H "Authorization: $LINEAR_API_KEY" \
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
        -H "Authorization: $LINEAR_API_KEY" \
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
        -H "Authorization: $LINEAR_API_KEY" \
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
        -H "Authorization: $LINEAR_API_KEY" \
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
