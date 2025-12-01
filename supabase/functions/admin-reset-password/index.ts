import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      throw new Error('Unauthorized - Admin access required');
    }

    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      throw new Error('Email and new password are required');
    }

    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const complexity = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (complexity < 3) {
      throw new Error('Password must contain at least 3 of: uppercase, lowercase, number, special character');
    }

    console.log(`Admin ${user.email} resetting password for ${email}`);

    // Get user by email
    const { data: userData, error: getUserError } = await supabaseClient.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error listing users:', getUserError);
      throw new Error(`Failed to list users: ${getUserError.message}`);
    }

    const targetUser = userData.users.find(u => u.email === email);
    
    if (!targetUser) {
      console.log(`User not found in auth system, creating new account: ${email}`);
      
      // Create new user with the provided password
      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password: newPassword,
        email_confirm: true,
        user_metadata: {
          name: email.split('@')[0]
        }
      });

      if (createError) {
        console.error('Error creating user:', createError);
        throw new Error(`Failed to create user account: ${createError.message}`);
      }

      console.log(`Account created and password set for ${email}`);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Account created and password set successfully', created: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Update existing user password
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      targetUser.id,
      { password: newPassword }
    );

    if (updateError) {
      throw updateError;
    }

    console.log(`Password reset successful for ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Password reset successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in admin-reset-password:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
