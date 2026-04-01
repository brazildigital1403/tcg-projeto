import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcmcrtiawacjgjexpxam.supabase.co'
const supabaseKey = 'sb_publishable_PX6Q3r70Ec8Y2eK9IaF78A_2b5rqm6y'

export const supabase = createClient(supabaseUrl, supabaseKey)