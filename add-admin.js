import dotenv from 'dotenv';
import { Client, Teams, Users } from 'node-appwrite';

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const teams = new Teams(client);
const users = new Users(client);

async function addUserToAdminTeam() {
    try {
        console.log('🔍 Adding user to admin team...\n');

        const adminTeamId = process.env.VITE_APPWRITE_ADMIN_TEAM_ID || 'admin-team';

        // Get user email from command line argument
        const userEmail = process.argv[2];

        if (!userEmail) {
            console.error('❌ Please provide user email as argument:');
            console.error('   node add-admin.js your-email@example.com');
            process.exit(1);
        }

        console.log(`Looking for user with email: ${userEmail}`);

        // Find user by email
        const usersList = await users.list();
        const user = usersList.users.find(u => u.email === userEmail);

        if (!user) {
            console.error(`❌ User with email ${userEmail} not found`);
            console.error('   Make sure the user has logged in at least once');
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.name} (${user.email})`);

        // Add user to admin team
        try {
            await teams.createMembership(
                adminTeamId,
                ['owner'],  // Give owner role
                user.email  // Use email for invitation
            );
            console.log(`✅ Successfully added ${user.email} to admin team!`);
        } catch (error) {
            if (error.code === 409) {
                console.log(`ℹ️  User ${user.email} is already in admin team`);
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addUserToAdminTeam();
