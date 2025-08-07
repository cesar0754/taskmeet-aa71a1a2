-- Corrigir função de validação com search_path seguro
CREATE OR REPLACE FUNCTION validate_invitation_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Invitation expiry date must be in the future';
  END IF;
  RETURN NEW;
END;
$$;