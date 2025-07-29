import dotenv from 'dotenv';
import { Client, Databases, Teams, Users } from 'node-appwrite';
import { DATABASE_SCHEMA, TEAM_SCHEMA } from '../src/lib/schema.js';

dotenv.config();

const config = {
    endpoint: process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY,
    databaseId: process.env.VITE_APPWRITE_DATABASE_ID || 'blog-database',
    adminTeamId: process.env.VITE_APPWRITE_ADMIN_TEAM_ID || 'admin-team'
};

console.log('🔍 Environment Variables Check:');
console.log(`   VITE_APPWRITE_PROJECT_ID: ${config.projectId ? '✅ Set' : '❌ Missing'}`);
console.log(`   APPWRITE_API_KEY: ${config.apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`   VITE_APPWRITE_ENDPOINT: ${config.endpoint}`);
console.log(`   VITE_APPWRITE_DATABASE_ID: ${config.databaseId}`);
console.log(`   VITE_APPWRITE_ADMIN_TEAM_ID: ${config.adminTeamId}\n`);

if (!config.projectId || !config.apiKey) {
    console.error('❌ Missing required environment variables:');
    if (!config.projectId) console.error('   VITE_APPWRITE_PROJECT_ID');
    if (!config.apiKey) console.error('   APPWRITE_API_KEY');
    console.error('\n📋 Setup Instructions:');
    console.error('1. Copy .env.example to .env: cp .env.example .env');
    console.error('2. Update .env with your Appwrite project details');
    console.error('3. Get your API key from Appwrite Console > Settings > API Keys');
    console.error('4. Make sure the API key has Database and Teams permissions');
    process.exit(1);
}

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

const databases = new Databases(client);
const teams = new Teams(client);
const users = new Users(client);

async function setupDatabase() {
    try {
        console.log('🚀 Setting up Appwrite database...\n');

        // Create database
        console.log('📦 Creating database...');
        try {
            await databases.create(
                DATABASE_SCHEMA.databaseId,
                DATABASE_SCHEMA.name
            );
            console.log('✅ Database created successfully');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  Database already exists');
            } else {
                throw error;
            }
        }

        // Create collections
        for (const [collectionKey, collection] of Object.entries(DATABASE_SCHEMA.collections)) {
            console.log(`\n📋 Creating collection: ${collection.name}...`);

            try {
                await databases.createCollection(
                    DATABASE_SCHEMA.databaseId,
                    collection.id,
                    collection.name,
                    collection.permissions
                );
                console.log(`✅ Collection '${collection.name}' created`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️  Collection '${collection.name}' already exists`);
                } else {
                    throw error;
                }
            }

            // Create attributes
            console.log(`   Creating attributes for ${collection.name}...`);
            for (const attr of collection.attributes) {
                try {
                    await createAttribute(DATABASE_SCHEMA.databaseId, collection.id, attr);
                    console.log(`   ✅ Attribute '${attr.key}' created`);
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`   ℹ️  Attribute '${attr.key}' already exists`);
                    } else {
                        console.log(`   ❌ Failed to create attribute '${attr.key}':`, error.message);
                    }
                }
            }

            // Wait a bit for attributes to be ready
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create indexes
            console.log(`   Creating indexes for ${collection.name}...`);
            for (const index of collection.indexes) {
                try {
                    await databases.createIndex(
                        DATABASE_SCHEMA.databaseId,
                        collection.id,
                        index.key,
                        index.type,
                        index.attributes
                    );
                    console.log(`   ✅ Index '${index.key}' created`);
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`   ℹ️  Index '${index.key}' already exists`);
                    } else {
                        console.log(`   ❌ Failed to create index '${index.key}':`, error.message);
                    }
                }
            }
        }

        console.log('\n🎉 Database setup completed successfully!');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

async function createAttribute(databaseId, collectionId, attr) {
    const { key, type, required, array } = attr;

    switch (type) {
        case 'string':
            return await databases.createStringAttribute(
                databaseId,
                collectionId,
                key,
                attr.size,
                required,
                attr.default,
                array
            );

        case 'integer':
            return await databases.createIntegerAttribute(
                databaseId,
                collectionId,
                key,
                required,
                attr.min,
                attr.max,
                attr.default,
                array
            );

        case 'boolean':
            return await databases.createBooleanAttribute(
                databaseId,
                collectionId,
                key,
                required,
                attr.default,
                array
            );

        case 'datetime':
            return await databases.createDatetimeAttribute(
                databaseId,
                collectionId,
                key,
                required,
                attr.default,
                array
            );

        default:
            throw new Error(`Unsupported attribute type: ${type}`);
    }
}

async function setupTeams() {
    try {
        console.log('\n👥 Setting up admin team...');

        const adminTeam = TEAM_SCHEMA.adminTeam;

        try {
            await teams.create(
                adminTeam.id,
                adminTeam.name,
                adminTeam.roles
            );
            console.log('✅ Admin team created successfully');
            console.log(`ℹ️  Team ID: ${adminTeam.id}`);
            console.log('📝 Make sure to add yourself to this team in the Appwrite console');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  Admin team already exists');
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('❌ Team setup failed:', error.message);
    }
}

async function main() {
    console.log('🦆 Appwrite Blog Setup\n');
    console.log('Configuration:');
    console.log(`  Endpoint: ${config.endpoint}`);
    console.log(`  Project ID: ${config.projectId}`);
    console.log(`  Database ID: ${config.databaseId}\n`);

    await setupDatabase();
    await setupTeams();

    console.log('\n📋 Next Steps:');
    console.log('1. Go to your Appwrite console');
    console.log('2. Add yourself to the admin team');
    console.log('3. Set up OAuth providers (Google) if needed');
    console.log('4. Update your .env file with the correct IDs');
    console.log('5. Start creating blog posts!');
    console.log('\n🚀 Happy blogging!');
}

main().catch(console.error);
