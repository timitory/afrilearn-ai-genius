
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view profiles in their institution" ON public.user_profiles;

-- Create a security definer function to get the current user's institution_id
-- This prevents infinite recursion by executing with elevated privileges
CREATE OR REPLACE FUNCTION public.get_current_user_institution_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT institution_id FROM public.user_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a new policy using the security definer function
CREATE POLICY "Users can view profiles in their institution" 
  ON public.user_profiles 
  FOR SELECT 
  USING (
    institution_id IS NOT NULL AND 
    institution_id = public.get_current_user_institution_id()
  );
