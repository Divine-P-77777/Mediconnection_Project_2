

-- update_health_center_approval
-- BEGIN
--   IF NEW.raw_user_meta_data ->> 'role' = 'health_center' THEN
--     UPDATE public.health_centers
--     SET approved = (NEW.raw_user_meta_data ->> 'approved')::boolean
--     WHERE id = NEW.id;
--   END IF;
--   RETURN NEW;
-- END;



-- set_center_id
-- begin
--   if new.center_id is null then
--     new.center_id := auth.uid();
--   end if;
--   return new;
-- end;


-- Name	Table	Function	Events	Orientation	Enabled	
-- health_center_update	
-- users

-- update_health_center_approval

-- AFTER UPDATE
-- ROW

