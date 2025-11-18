--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'student'
);


--
-- Name: generate_student_link(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_student_link(p_student_id uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_token text;
  v_base_url text := 'https://eduintbd.com/student/';
BEGIN
  -- Generate a unique token
  v_token := encode(gen_random_bytes(16), 'hex');
  
  -- Insert or update the student link
  INSERT INTO public.student_links (student_id, unique_token, link_url)
  VALUES (p_student_id, v_token, v_base_url || v_token)
  ON CONFLICT (student_id) 
  DO UPDATE SET 
    unique_token = v_token,
    link_url = v_base_url || v_token;
  
  RETURN v_base_url || v_token;
END;
$$;


--
-- Name: handle_new_ielts_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_ielts_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    achievement_type text NOT NULL,
    title text NOT NULL,
    description text,
    badge_icon text,
    earned_at timestamp with time zone DEFAULT now()
);


--
-- Name: communication_channels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communication_channels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    channel_type text NOT NULL,
    channel_identifier text NOT NULL,
    is_active boolean DEFAULT true,
    last_message_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT communication_channels_channel_type_check CHECK ((channel_type = ANY (ARRAY['whatsapp'::text, 'zoho_mail'::text, 'facebook'::text, 'messenger'::text])))
);


--
-- Name: custom_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_fields (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    field_name text NOT NULL,
    field_label text NOT NULL,
    field_type text NOT NULL,
    field_options jsonb,
    is_required boolean DEFAULT false,
    is_visible_to_student boolean DEFAULT true,
    is_editable_by_student boolean DEFAULT false,
    field_category text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    show_in_table boolean DEFAULT false,
    show_in_details boolean DEFAULT true
);


--
-- Name: ielts_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ielts_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    module_type text NOT NULL,
    difficulty text NOT NULL,
    content jsonb,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ielts_modules_difficulty_check CHECK ((difficulty = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text]))),
    CONSTRAINT ielts_modules_module_type_check CHECK ((module_type = ANY (ARRAY['reading'::text, 'writing'::text, 'listening'::text, 'speaking'::text])))
);


--
-- Name: problem_areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.problem_areas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    module_type text NOT NULL,
    skill_area text NOT NULL,
    error_count integer DEFAULT 1,
    last_error_at timestamp with time zone DEFAULT now(),
    improvement_suggestions text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT problem_areas_module_type_check CHECK ((module_type = ANY (ARRAY['reading'::text, 'writing'::text, 'listening'::text, 'speaking'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    target_score numeric(3,1),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    module_id uuid,
    question_id uuid,
    user_answer text NOT NULL,
    is_correct boolean,
    ai_feedback text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid,
    question_text text NOT NULL,
    question_type text NOT NULL,
    correct_answer text,
    options jsonb,
    explanation text,
    points integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT quiz_questions_question_type_check CHECK ((question_type = ANY (ARRAY['multiple_choice'::text, 'true_false'::text, 'fill_blank'::text, 'essay'::text])))
);


--
-- Name: student_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    activity_type text NOT NULL,
    activity_title text NOT NULL,
    activity_description text,
    activity_metadata jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: student_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    name text NOT NULL,
    study_destination text,
    study_year text,
    details text,
    status text DEFAULT 'submitted'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    documents_uploaded boolean DEFAULT false,
    session_booked boolean DEFAULT false,
    session_date timestamp with time zone,
    competitor_universities text,
    preferred_partners text,
    document_urls text[],
    meeting_link text,
    application_status text DEFAULT 'initial_inquiry'::text,
    visa_status text DEFAULT 'not_started'::text,
    visa_application_date date,
    visa_approval_date date,
    enrolled_university text,
    course_name text,
    intake_semester text,
    tuition_fees numeric(10,2),
    scholarship_amount numeric(10,2),
    admin_notes text,
    assigned_counselor text,
    priority_level text DEFAULT 'medium'::text,
    offer_letter_received boolean DEFAULT false,
    cas_received boolean DEFAULT false,
    deposit_paid boolean DEFAULT false,
    deposit_amount numeric(10,2),
    consultation_completed boolean DEFAULT false,
    lifecycle_stage text DEFAULT 'Lead Generation'::text,
    session_notes text,
    CONSTRAINT student_applications_status_check CHECK ((status = ANY (ARRAY['submitted'::text, 'documents_collection'::text, 'plan_customization'::text, 'offer_admission'::text, 'visa_relocation'::text])))
);


--
-- Name: student_field_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_field_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    field_id uuid NOT NULL,
    field_value text,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid
);


--
-- Name: student_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    unique_token text NOT NULL,
    link_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone
);


--
-- Name: student_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    sender_email text NOT NULL,
    sender_type text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone,
    CONSTRAINT student_messages_sender_type_check CHECK ((sender_type = ANY (ARRAY['student'::text, 'admin'::text])))
);


--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    module_id uuid,
    completed boolean DEFAULT false,
    score numeric(5,2),
    time_spent integer,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: communication_channels communication_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_channels
    ADD CONSTRAINT communication_channels_pkey PRIMARY KEY (id);


--
-- Name: custom_fields custom_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_fields
    ADD CONSTRAINT custom_fields_pkey PRIMARY KEY (id);


--
-- Name: ielts_modules ielts_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ielts_modules
    ADD CONSTRAINT ielts_modules_pkey PRIMARY KEY (id);


--
-- Name: problem_areas problem_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem_areas
    ADD CONSTRAINT problem_areas_pkey PRIMARY KEY (id);


--
-- Name: problem_areas problem_areas_user_id_module_type_skill_area_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem_areas
    ADD CONSTRAINT problem_areas_user_id_module_type_skill_area_key UNIQUE (user_id, module_type, skill_area);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- Name: student_activities student_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_activities
    ADD CONSTRAINT student_activities_pkey PRIMARY KEY (id);


--
-- Name: student_applications student_applications_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_applications
    ADD CONSTRAINT student_applications_email_key UNIQUE (email);


--
-- Name: student_applications student_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_applications
    ADD CONSTRAINT student_applications_pkey PRIMARY KEY (id);


--
-- Name: student_field_values student_field_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_field_values
    ADD CONSTRAINT student_field_values_pkey PRIMARY KEY (id);


--
-- Name: student_field_values student_field_values_student_id_field_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_field_values
    ADD CONSTRAINT student_field_values_student_id_field_id_key UNIQUE (student_id, field_id);


--
-- Name: student_links student_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_links
    ADD CONSTRAINT student_links_pkey PRIMARY KEY (id);


--
-- Name: student_links student_links_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_links
    ADD CONSTRAINT student_links_student_id_key UNIQUE (student_id);


--
-- Name: student_links student_links_unique_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_links
    ADD CONSTRAINT student_links_unique_token_key UNIQUE (unique_token);


--
-- Name: student_messages student_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_messages
    ADD CONSTRAINT student_messages_pkey PRIMARY KEY (id);


--
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- Name: user_progress user_progress_user_id_module_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_module_id_key UNIQUE (user_id, module_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_achievements_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_achievements_user_id ON public.achievements USING btree (user_id);


--
-- Name: idx_communication_channels_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_communication_channels_student_id ON public.communication_channels USING btree (student_id);


--
-- Name: idx_communication_channels_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_communication_channels_type ON public.communication_channels USING btree (channel_type);


--
-- Name: idx_problem_areas_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_problem_areas_user_id ON public.problem_areas USING btree (user_id);


--
-- Name: idx_quiz_attempts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts USING btree (user_id);


--
-- Name: idx_quiz_questions_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quiz_questions_module_id ON public.quiz_questions USING btree (module_id);


--
-- Name: idx_student_activities_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_activities_created ON public.student_activities USING btree (created_at DESC);


--
-- Name: idx_student_activities_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_activities_student ON public.student_activities USING btree (student_id);


--
-- Name: idx_student_applications_lifecycle_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_applications_lifecycle_stage ON public.student_applications USING btree (lifecycle_stage);


--
-- Name: idx_student_applications_meeting_link; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_applications_meeting_link ON public.student_applications USING btree (meeting_link) WHERE (meeting_link IS NOT NULL);


--
-- Name: idx_student_field_values_field; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_field_values_field ON public.student_field_values USING btree (field_id);


--
-- Name: idx_student_field_values_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_field_values_student ON public.student_field_values USING btree (student_id);


--
-- Name: idx_student_links_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_links_token ON public.student_links USING btree (unique_token);


--
-- Name: idx_student_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_messages_created_at ON public.student_messages USING btree (created_at DESC);


--
-- Name: idx_student_messages_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_messages_student_id ON public.student_messages USING btree (student_id);


--
-- Name: idx_user_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_progress_user_id ON public.user_progress USING btree (user_id);


--
-- Name: idx_user_roles_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_role ON public.user_roles USING btree (role);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: communication_channels update_communication_channels_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_communication_channels_updated_at BEFORE UPDATE ON public.communication_channels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: custom_fields update_custom_fields_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_custom_fields_updated_at BEFORE UPDATE ON public.custom_fields FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: student_applications update_student_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_student_applications_updated_at BEFORE UPDATE ON public.student_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: student_field_values update_student_field_values_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_student_field_values_updated_at BEFORE UPDATE ON public.student_field_values FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: achievements achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: communication_channels communication_channels_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_channels
    ADD CONSTRAINT communication_channels_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_applications(id) ON DELETE CASCADE;


--
-- Name: student_messages fk_student; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_messages
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student_applications(id) ON DELETE CASCADE;


--
-- Name: problem_areas problem_areas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem_areas
    ADD CONSTRAINT problem_areas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.ielts_modules(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.ielts_modules(id) ON DELETE CASCADE;


--
-- Name: student_activities student_activities_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_activities
    ADD CONSTRAINT student_activities_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: student_activities student_activities_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_activities
    ADD CONSTRAINT student_activities_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_applications(id) ON DELETE CASCADE;


--
-- Name: student_field_values student_field_values_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_field_values
    ADD CONSTRAINT student_field_values_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.custom_fields(id) ON DELETE CASCADE;


--
-- Name: student_field_values student_field_values_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_field_values
    ADD CONSTRAINT student_field_values_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_applications(id) ON DELETE CASCADE;


--
-- Name: student_field_values student_field_values_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_field_values
    ADD CONSTRAINT student_field_values_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: student_links student_links_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_links
    ADD CONSTRAINT student_links_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student_applications(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.ielts_modules(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) AND (NOT ((user_id = auth.uid()) AND (role = 'admin'::public.app_role)))));


--
-- Name: communication_channels Admins can insert channels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert channels" ON public.communication_channels FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_links Admins can insert links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert links" ON public.student_links FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_activities Admins can manage all activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all activities" ON public.student_activities USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_field_values Admins can manage all field values; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all field values" ON public.student_field_values USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: custom_fields Admins can manage custom fields; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage custom fields" ON public.custom_fields USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_messages Admins can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can send messages" ON public.student_messages FOR INSERT WITH CHECK (((sender_type = 'admin'::text) AND public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: student_applications Admins can update all applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all applications" ON public.student_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: communication_channels Admins can update channels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update channels" ON public.communication_channels FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_messages Admins can update messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update messages" ON public.student_messages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_applications Admins can view all applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all applications" ON public.student_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: communication_channels Admins can view all channels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all channels" ON public.communication_channels FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_links Admins can view all links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all links" ON public.student_links FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_messages Admins can view all messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all messages" ON public.student_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: student_applications Anyone can create application; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create application" ON public.student_applications FOR INSERT WITH CHECK (true);


--
-- Name: student_links Anyone can view link by token; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view link by token" ON public.student_links FOR SELECT USING (true);


--
-- Name: ielts_modules Anyone can view modules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view modules" ON public.ielts_modules FOR SELECT USING (true);


--
-- Name: quiz_questions Authenticated users can view questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view questions" ON public.quiz_questions FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: student_field_values Students can insert their editable field values; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can insert their editable field values" ON public.student_field_values FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.student_applications sa
     JOIN public.custom_fields cf ON ((cf.id = student_field_values.field_id)))
  WHERE ((sa.id = student_field_values.student_id) AND (sa.email = auth.email()) AND (cf.is_editable_by_student = true)))));


--
-- Name: student_messages Students can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can send messages" ON public.student_messages FOR INSERT WITH CHECK (((sender_type = 'student'::text) AND (sender_email = auth.email()) AND (EXISTS ( SELECT 1
   FROM public.student_applications
  WHERE ((student_applications.id = student_messages.student_id) AND (student_applications.email = auth.email()))))));


--
-- Name: student_field_values Students can update editable field values; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can update editable field values" ON public.student_field_values FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM (public.student_applications sa
     JOIN public.custom_fields cf ON ((cf.id = student_field_values.field_id)))
  WHERE ((sa.id = student_field_values.student_id) AND (sa.email = auth.email()) AND (cf.is_editable_by_student = true)))));


--
-- Name: student_messages Students can update own messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can update own messages" ON public.student_messages FOR UPDATE USING ((sender_email = auth.email()));


--
-- Name: communication_channels Students can view own channels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own channels" ON public.communication_channels FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.student_applications
  WHERE ((student_applications.id = communication_channels.student_id) AND (student_applications.email = auth.email())))));


--
-- Name: student_links Students can view own link; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own link" ON public.student_links FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.student_applications
  WHERE ((student_applications.id = student_links.student_id) AND (student_applications.email = auth.email())))));


--
-- Name: student_activities Students can view their activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view their activities" ON public.student_activities FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.student_applications sa
  WHERE ((sa.id = student_activities.student_id) AND (sa.email = auth.email())))));


--
-- Name: student_field_values Students can view their field values; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view their field values" ON public.student_field_values FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.student_applications sa
  WHERE ((sa.id = student_field_values.student_id) AND (sa.email = auth.email())))));


--
-- Name: student_messages Students can view their messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view their messages" ON public.student_messages FOR SELECT USING (((sender_email = auth.email()) OR (EXISTS ( SELECT 1
   FROM public.student_applications
  WHERE ((student_applications.id = student_messages.student_id) AND (student_applications.email = auth.email()))))));


--
-- Name: custom_fields Students can view visible fields; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view visible fields" ON public.custom_fields FOR SELECT USING ((is_visible_to_student = true));


--
-- Name: achievements Users can insert own achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own achievements" ON public.achievements FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: quiz_attempts Users can insert own attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: problem_areas Users can insert own problem areas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own problem areas" ON public.problem_areas FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_progress Users can insert own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: student_applications Users can update own application; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own application" ON public.student_applications FOR UPDATE USING ((email = auth.email())) WITH CHECK ((email = auth.email()));


--
-- Name: problem_areas Users can update own problem areas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own problem areas" ON public.problem_areas FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: user_progress Users can update own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: achievements Users can view own achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own achievements" ON public.achievements FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: student_applications Users can view own application; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own application" ON public.student_applications FOR SELECT USING ((email = auth.email()));


--
-- Name: quiz_attempts Users can view own attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: problem_areas Users can view own problem areas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own problem areas" ON public.problem_areas FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_progress Users can view own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

--
-- Name: communication_channels; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communication_channels ENABLE ROW LEVEL SECURITY;

--
-- Name: custom_fields; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;

--
-- Name: ielts_modules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ielts_modules ENABLE ROW LEVEL SECURITY;

--
-- Name: problem_areas; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.problem_areas ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_attempts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: student_activities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;

--
-- Name: student_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: student_field_values; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_field_values ENABLE ROW LEVEL SECURITY;

--
-- Name: student_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_links ENABLE ROW LEVEL SECURITY;

--
-- Name: student_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: user_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


