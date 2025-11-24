
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('Checking database tables...');
    
    // Simple check if tables exist by trying to query them
    const { error: storiesError } = await supabase
      .from('stories')
      .select('id')
      .limit(1);
    
    if (storiesError) {
      if (storiesError.code === '42P01') {
        console.log('📋 "stories" table not found. Creating it now...');
        
        // Define and run table creation query
        const { error: createTableError } = await supabase.rpc('exec', {
          sql: `
            CREATE TABLE stories (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ,
              title TEXT,
              description TEXT,
              author TEXT,
              author_id TEXT,
              genre TEXT,
              cover_image TEXT,
              content TEXT,
              tags TEXT[],
              status TEXT,
              word_count INTEGER,
              audio_available BOOLEAN
            );
          `
        });

        if (createTableError) {
          console.error('Error creating "stories" table:', createTableError);
        } else {
          console.log('✅ "stories" table created successfully.');
        }
      } else {
        console.error('Database connection error:', storiesError);
      }
    } else {
      console.log('✅ Database tables detected and ready');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Health check endpoint
app.get("/make-server-03cf1b4d/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Stories endpoints
app.get("/make-server-03cf1b4d/stories", async (c) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      // Handle missing table gracefully
      if (error.code === '42P01') {
        console.log('Stories table does not exist. Returning empty array.');
        return c.json({ success: true, data: [], message: 'Database tables not set up yet' });
      }
      
      console.error('Error fetching stories:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Server error fetching stories:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-03cf1b4d/stories", async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('stories')
      .insert([{
        title: body.title,
        description: body.description,
        author: body.author,
        author_id: body.authorId,
        genre: body.genre,
        cover_image: body.coverImage,
        content: body.content,
        tags: body.tags || [],
        status: body.status || 'published',
        word_count: body.wordCount || 0,
        audio_available: body.audioAvailable || false
      }])
      .select()
      .single();

    if (error) {
      // Handle missing table gracefully
      if (error.code === '42P01') {
        console.log('Stories table does not exist. Cannot create story.');
        return c.json({ 
          success: false, 
          error: 'Database tables not set up yet. Please create the required tables first.',
          code: 'TABLES_NOT_FOUND'
        }, 503);
      }
      
      console.error('Error creating story:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error('Server error creating story:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-03cf1b4d/stories/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      // Handle missing table gracefully
      if (error.code === '42P01') {
        console.log('Stories table does not exist. Returning empty array.');
        return c.json({ success: true, data: [], message: 'Database tables not set up yet' });
      }
      
      console.error('Error fetching user stories:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Server error fetching user stories:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-03cf1b4d/stories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('stories')
      .update({
        title: body.title,
        description: body.description,
        genre: body.genre,
        cover_image: body.coverImage,
        content: body.content,
        tags: body.tags,
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating story:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error('Server error updating story:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

app.delete("/make-server-03cf1b4d/stories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting story:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Server error deleting story:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Start the server after ensuring the database is initialized
const startServer = async () => {
  await initializeDatabase();
  Deno.serve(app.fetch);
};

startServer();
