--
-- PostgreSQL database dump
--

\restrict 16SE4nTdjjSvT4xoiWpememjWFiTJ6aO7aCbxEx5y3VmybccpcAC8tLZwgVDvbu

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-08-19 16:41:36

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
-- TOC entry 240 (class 1255 OID 16560)
-- Name: calculate_match_percentage(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_match_percentage(p_student_id integer, p_internship_id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_skills INTEGER;
    matched_skills INTEGER;
BEGIN

    SELECT COUNT(*)
    INTO total_skills
    FROM unnest(
        string_to_array(
            (SELECT required_skills
             FROM internships
             WHERE internship_id = p_internship_id),
            ','
        )
    );

    SELECT COUNT(*)
    INTO matched_skills
    FROM unnest(
        string_to_array(
            (SELECT required_skills
             FROM internships
             WHERE internship_id = p_internship_id),
            ','
        )
    ) AS required_skill
    WHERE EXISTS (
        SELECT 1
        FROM student_skills ss
        WHERE ss.student_id = p_student_id
        AND LOWER(TRIM(ss.skill_name))
            = LOWER(TRIM(required_skill))
    );

    IF total_skills = 0 THEN
        RETURN 0;
    END IF;

    RETURN ROUND(
        (matched_skills::NUMERIC / total_skills) * 100,
        2
    );

END;
$$;


ALTER FUNCTION public.calculate_match_percentage(p_student_id integer, p_internship_id integer) OWNER TO postgres;

--
-- TOC entry 241 (class 1255 OID 16561)
-- Name: normalize_student_skill(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.normalize_student_skill() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.skill_name := LOWER(TRIM(NEW.skill_name));
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.normalize_student_skill() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16458)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16457)
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_admin_id_seq OWNER TO postgres;

--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 227
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- TOC entry 234 (class 1259 OID 16517)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    application_id integer NOT NULL,
    student_id integer NOT NULL,
    internship_id integer NOT NULL,
    application_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'Applied'::character varying,
    cover_letter text
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16516)
-- Name: applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_application_id_seq OWNER TO postgres;

--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 233
-- Name: applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_application_id_seq OWNED BY public.applications.application_id;


--
-- TOC entry 224 (class 1259 OID 16423)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id integer NOT NULL,
    user_id integer NOT NULL,
    company_name character varying(150) NOT NULL,
    industry character varying(100),
    website character varying(255)
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16422)
-- Name: companies_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_company_id_seq OWNER TO postgres;

--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 223
-- Name: companies_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_company_id_seq OWNED BY public.companies.company_id;


--
-- TOC entry 226 (class 1259 OID 16442)
-- Name: faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty (
    faculty_id integer NOT NULL,
    user_id integer NOT NULL,
    department character varying(100),
    designation character varying(100)
);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16441)
-- Name: faculty_faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculty_faculty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculty_faculty_id_seq OWNER TO postgres;

--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 225
-- Name: faculty_faculty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculty_faculty_id_seq OWNED BY public.faculty.faculty_id;


--
-- TOC entry 232 (class 1259 OID 16498)
-- Name: internships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.internships (
    internship_id integer NOT NULL,
    company_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    required_skills text,
    location character varying(100),
    work_mode character varying(50),
    stipend numeric(10,2),
    duration_months integer,
    openings integer,
    eligibility character varying(255),
    application_deadline date,
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.internships OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16481)
-- Name: student_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_skills (
    skill_id integer NOT NULL,
    student_id integer NOT NULL,
    skill_name character varying(100) NOT NULL,
    skill_level integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT student_skills_skill_level_check CHECK (((skill_level >= 1) AND (skill_level <= 100)))
);


ALTER TABLE public.student_skills OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16407)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    student_id integer NOT NULL,
    user_id integer NOT NULL,
    college_id character varying(50),
    course character varying(100),
    year integer,
    phone character varying(20),
    cgpa numeric(4,2),
    resume_url text,
    preferred_domain character varying(100),
    preferred_location character varying(100),
    linkedin_url text,
    github_url text,
    profile_photo_url text
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16550)
-- Name: internship_recommendation_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.internship_recommendation_view AS
 SELECT s.student_id,
    i.internship_id,
    i.title AS internship,
    c.company_name,
    i.location,
    count(DISTINCT lower(TRIM(BOTH FROM required_skill.required_skill))) AS total_required_skills,
    count(DISTINCT
        CASE
            WHEN (ss.skill_name IS NOT NULL) THEN lower(TRIM(BOTH FROM required_skill.required_skill))
            ELSE NULL::text
        END) AS matched_skills,
    round((((count(DISTINCT
        CASE
            WHEN (ss.skill_name IS NOT NULL) THEN lower(TRIM(BOTH FROM required_skill.required_skill))
            ELSE NULL::text
        END))::numeric / (NULLIF(count(DISTINCT lower(TRIM(BOTH FROM required_skill.required_skill))), 0))::numeric) * (100)::numeric), 2) AS match_percentage
   FROM ((((public.students s
     CROSS JOIN public.internships i)
     JOIN public.companies c ON ((c.company_id = i.company_id)))
     CROSS JOIN LATERAL unnest(string_to_array(i.required_skills, ','::text)) required_skill(required_skill))
     LEFT JOIN public.student_skills ss ON (((ss.student_id = s.student_id) AND (lower(TRIM(BOTH FROM ss.skill_name)) = lower(TRIM(BOTH FROM required_skill.required_skill))))))
  GROUP BY s.student_id, i.internship_id, i.title, c.company_name, i.location;


ALTER VIEW public.internship_recommendation_view OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16542)
-- Name: internship_recommendations; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.internship_recommendations AS
 SELECT s.student_id,
    i.internship_id,
    i.title AS internship,
    c.company_name,
    i.location,
    count(*) AS total_required_skills,
    count(ss.skill_id) AS matched_skills,
    round((((count(ss.skill_id))::numeric * 100.0) / (count(*))::numeric), 2) AS match_percentage
   FROM ((((public.students s
     CROSS JOIN public.internships i)
     JOIN public.companies c ON ((c.company_id = i.company_id)))
     CROSS JOIN LATERAL unnest(string_to_array(i.required_skills, ','::text)) required_skill(required_skill))
     LEFT JOIN public.student_skills ss ON (((ss.student_id = s.student_id) AND (lower(TRIM(BOTH FROM ss.skill_name)) = lower(TRIM(BOTH FROM required_skill.required_skill))))))
  GROUP BY s.student_id, i.internship_id, i.title, c.company_name, i.location;


ALTER VIEW public.internship_recommendations OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16497)
-- Name: internships_internship_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.internships_internship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internships_internship_id_seq OWNER TO postgres;

--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 231
-- Name: internships_internship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.internships_internship_id_seq OWNED BY public.internships.internship_id;


--
-- TOC entry 239 (class 1259 OID 16564)
-- Name: skill_learning_resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_learning_resources (
    resource_id integer NOT NULL,
    skill_name character varying(100) NOT NULL,
    resource_type character varying(30) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    resource_url text NOT NULL,
    action_text character varying(50) DEFAULT 'Start Learning'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT skill_learning_resources_resource_type_check CHECK (((resource_type)::text = ANY ((ARRAY['YouTube'::character varying, 'Article'::character varying, 'Practice'::character varying])::text[])))
);


ALTER TABLE public.skill_learning_resources OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16563)
-- Name: skill_learning_resources_resource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skill_learning_resources_resource_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skill_learning_resources_resource_id_seq OWNER TO postgres;

--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 238
-- Name: skill_learning_resources_resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skill_learning_resources_resource_id_seq OWNED BY public.skill_learning_resources.resource_id;


--
-- TOC entry 237 (class 1259 OID 16555)
-- Name: student_skill_gap_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.student_skill_gap_view AS
 SELECT s.student_id,
    i.internship_id,
    i.title AS internship,
    c.company_name,
    lower(TRIM(BOTH FROM required_skill.required_skill)) AS missing_skill
   FROM ((((public.students s
     CROSS JOIN public.internships i)
     JOIN public.companies c ON ((c.company_id = i.company_id)))
     CROSS JOIN LATERAL unnest(string_to_array(i.required_skills, ','::text)) required_skill(required_skill))
     LEFT JOIN public.student_skills ss ON (((ss.student_id = s.student_id) AND (lower(TRIM(BOTH FROM ss.skill_name)) = lower(TRIM(BOTH FROM required_skill.required_skill))))))
  WHERE (ss.skill_id IS NULL);


ALTER VIEW public.student_skill_gap_view OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16480)
-- Name: student_skills_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_skills_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_skills_skill_id_seq OWNER TO postgres;

--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 229
-- Name: student_skills_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_skills_skill_id_seq OWNED BY public.student_skills.skill_id;


--
-- TOC entry 221 (class 1259 OID 16406)
-- Name: students_student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_student_id_seq OWNER TO postgres;

--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 221
-- Name: students_student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_student_id_seq OWNED BY public.students.student_id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4915 (class 2604 OID 16461)
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 16520)
-- Name: applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN application_id SET DEFAULT nextval('public.applications_application_id_seq'::regclass);


--
-- TOC entry 4913 (class 2604 OID 16426)
-- Name: companies company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN company_id SET DEFAULT nextval('public.companies_company_id_seq'::regclass);


--
-- TOC entry 4914 (class 2604 OID 16445)
-- Name: faculty faculty_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty ALTER COLUMN faculty_id SET DEFAULT nextval('public.faculty_faculty_id_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 16501)
-- Name: internships internship_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internships ALTER COLUMN internship_id SET DEFAULT nextval('public.internships_internship_id_seq'::regclass);


--
-- TOC entry 4924 (class 2604 OID 16567)
-- Name: skill_learning_resources resource_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_learning_resources ALTER COLUMN resource_id SET DEFAULT nextval('public.skill_learning_resources_resource_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 16484)
-- Name: student_skills skill_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_skills ALTER COLUMN skill_id SET DEFAULT nextval('public.student_skills_skill_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 16410)
-- Name: students student_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN student_id SET DEFAULT nextval('public.students_student_id_seq'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16393)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5130 (class 0 OID 16458)
-- Dependencies: 228
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (admin_id, user_id) FROM stdin;
1	5
\.


--
-- TOC entry 5136 (class 0 OID 16517)
-- Dependencies: 234
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (application_id, student_id, internship_id, application_date, status, cover_letter) FROM stdin;
1	1	1	2026-08-19 12:35:12.748439	Shortlisted	I am interested in this Data Analyst Internship and would like to apply my Python and SQL skills.
\.


--
-- TOC entry 5126 (class 0 OID 16423)
-- Dependencies: 224
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, user_id, company_name, industry, website) FROM stdin;
1	1	Tech Solutions Pvt Ltd	Information Technology	https://techsolutions.com
2	3	Tech Solutions Pvt Ltd	Information Technology	https://techsolutions.com
\.


--
-- TOC entry 5128 (class 0 OID 16442)
-- Dependencies: 226
-- Data for Name: faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculty (faculty_id, user_id, department, designation) FROM stdin;
1	4	Computer Engineering	Assistant Professor
\.


--
-- TOC entry 5134 (class 0 OID 16498)
-- Dependencies: 232
-- Data for Name: internships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.internships (internship_id, company_id, title, description, required_skills, location, work_mode, stipend, duration_months, openings, eligibility, application_deadline, status, created_at) FROM stdin;
1	1	Data Analyst Intern	Work on data analysis, reporting and business insights.	Python, SQL, Excel, Power BI	Pune	Hybrid	20000.00	6	5	B.Tech/BCA/MCA students with basic programming knowledge	2026-09-30	active	2026-08-19 12:32:20.794645
2	1	Python Developer Intern	Work on Python development, APIs and backend applications.	Python,Git,SQL	Pune	\N	\N	\N	\N	\N	\N	active	2026-08-19 12:44:48.073711
3	1	Web Developer Intern	Work on frontend and web application development.	HTML,CSS,JavaScript,Git	Mumbai	\N	\N	\N	\N	\N	\N	active	2026-08-19 12:44:48.073711
4	1	Java Developer Intern	Work on Java based backend applications and databases.	Java,SQL,Git	Bangalore	\N	\N	\N	\N	\N	\N	active	2026-08-19 12:44:48.073711
\.


--
-- TOC entry 5138 (class 0 OID 16564)
-- Dependencies: 239
-- Data for Name: skill_learning_resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill_learning_resources (resource_id, skill_name, resource_type, title, description, resource_url, action_text, created_at) FROM stdin;
1	REST APIs	YouTube	Learn REST APIs	Learn REST API fundamentals, HTTP methods, endpoints and API requests.	https://www.youtube.com/results?search_query=REST+API+tutorial+for+beginners	Watch Video	2026-08-19 16:09:57.018309
2	REST APIs	Article	REST API Documentation	Learn REST API concepts, HTTP methods and how REST APIs work.	https://developer.mozilla.org/en-US/docs/Glossary/REST_API	Start Learning	2026-08-19 16:09:57.018309
3	REST APIs	Practice	Practice REST APIs with Postman	Practice GET, POST, PUT and DELETE API requests.	https://www.postman.com/	Practice	2026-08-19 16:09:57.018309
\.


--
-- TOC entry 5132 (class 0 OID 16481)
-- Dependencies: 230
-- Data for Name: student_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_skills (skill_id, student_id, skill_name, skill_level, created_at) FROM stdin;
1	1	Python	90	2026-08-19 12:27:11.137112
2	1	SQL	80	2026-08-19 12:27:11.137112
3	1	Java	70	2026-08-19 12:27:11.137112
4	1	Communication	85	2026-08-19 12:27:11.137112
5	1	Git	75	2026-08-19 12:27:11.137112
\.


--
-- TOC entry 5124 (class 0 OID 16407)
-- Dependencies: 222
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (student_id, user_id, college_id, course, year, phone, cgpa, resume_url, preferred_domain, preferred_location, linkedin_url, github_url, profile_photo_url) FROM stdin;
1	1	COL001	Computer Engineering	3	9876543210	\N	\N	\N	\N	https://www.linkedin.com/in/example	https://github.com/example	https://example.com/profile.jpg
\.


--
-- TOC entry 5122 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, email, password_hash, role, created_at) FROM stdin;
1	Test Student	student@test.com	$2b$10$PD.Nm2soFVsDfUpRPjTAVOU5WChU4bgOGJ2Ng8V4fxdYPkx2olUG2	STUDENT	2026-08-19 11:10:31.226197
3	Tech Solutions	company@test.com	$2b$10$PD.Nm2soFVsDfUpRPjTAVOU5WChU4bgOGJ2Ng8V4fxdYPkx2olUG2	COMPANY	2026-08-19 11:26:09.01514
4	Prof. Rahul Sharma	faculty@test.com	$2b$10$PD.Nm2soFVsDfUpRPjTAVOU5WChU4bgOGJ2Ng8V4fxdYPkx2olUG2	FACULTY	2026-08-19 11:28:18.067974
5	System Admin	admin@test.com	$2b$10$PD.Nm2soFVsDfUpRPjTAVOU5WChU4bgOGJ2Ng8V4fxdYPkx2olUG2	ADMIN	2026-08-19 11:30:35.544061
\.


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 227
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 1, true);


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 233
-- Name: applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_application_id_seq', 1, true);


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 223
-- Name: companies_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_company_id_seq', 2, true);


--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 225
-- Name: faculty_faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculty_faculty_id_seq', 1, true);


--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 231
-- Name: internships_internship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.internships_internship_id_seq', 4, true);


--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 238
-- Name: skill_learning_resources_resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skill_learning_resources_resource_id_seq', 3, true);


--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 229
-- Name: student_skills_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_skills_skill_id_seq', 6, true);


--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 221
-- Name: students_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_student_id_seq', 1, true);


--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 5, true);


--
-- TOC entry 4946 (class 2606 OID 16465)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 4948 (class 2606 OID 16467)
-- Name: admins admins_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);


--
-- TOC entry 4956 (class 2606 OID 16529)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 4958 (class 2606 OID 16531)
-- Name: applications applications_student_id_internship_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_student_id_internship_id_key UNIQUE (student_id, internship_id);


--
-- TOC entry 4938 (class 2606 OID 16433)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (company_id);


--
-- TOC entry 4940 (class 2606 OID 16435)
-- Name: companies companies_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_user_id_key UNIQUE (user_id);


--
-- TOC entry 4942 (class 2606 OID 16449)
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (faculty_id);


--
-- TOC entry 4944 (class 2606 OID 16451)
-- Name: faculty faculty_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_user_id_key UNIQUE (user_id);


--
-- TOC entry 4954 (class 2606 OID 16510)
-- Name: internships internships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_pkey PRIMARY KEY (internship_id);


--
-- TOC entry 4961 (class 2606 OID 16580)
-- Name: skill_learning_resources skill_learning_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_learning_resources
    ADD CONSTRAINT skill_learning_resources_pkey PRIMARY KEY (resource_id);


--
-- TOC entry 4951 (class 2606 OID 16491)
-- Name: student_skills student_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_pkey PRIMARY KEY (skill_id);


--
-- TOC entry 4934 (class 2606 OID 16414)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (student_id);


--
-- TOC entry 4936 (class 2606 OID 16416)
-- Name: students students_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_key UNIQUE (user_id);


--
-- TOC entry 4930 (class 2606 OID 16405)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4932 (class 2606 OID 16403)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4959 (class 1259 OID 16547)
-- Name: idx_applications_internship_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_internship_id ON public.applications USING btree (internship_id);


--
-- TOC entry 4952 (class 1259 OID 16549)
-- Name: idx_internships_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_internships_company_id ON public.internships USING btree (company_id);


--
-- TOC entry 4949 (class 1259 OID 16548)
-- Name: idx_student_skills_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_skills_student_id ON public.student_skills USING btree (student_id);


--
-- TOC entry 4970 (class 2620 OID 16562)
-- Name: student_skills trg_normalize_student_skill; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_normalize_student_skill BEFORE INSERT OR UPDATE OF skill_name ON public.student_skills FOR EACH ROW EXECUTE FUNCTION public.normalize_student_skill();


--
-- TOC entry 4968 (class 2606 OID 16537)
-- Name: applications applications_internship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(internship_id);


--
-- TOC entry 4969 (class 2606 OID 16532)
-- Name: applications applications_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id);


--
-- TOC entry 4965 (class 2606 OID 16468)
-- Name: admins fk_admin_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4963 (class 2606 OID 16436)
-- Name: companies fk_company_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT fk_company_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4964 (class 2606 OID 16452)
-- Name: faculty fk_faculty_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT fk_faculty_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4962 (class 2606 OID 16417)
-- Name: students fk_student_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4967 (class 2606 OID 16511)
-- Name: internships internships_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 4966 (class 2606 OID 16492)
-- Name: student_skills student_skills_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_skills
    ADD CONSTRAINT student_skills_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id);


-- Completed on 2026-08-19 16:41:36

--
-- PostgreSQL database dump complete
--

\unrestrict 16SE4nTdjjSvT4xoiWpememjWFiTJ6aO7aCbxEx5y3VmybccpcAC8tLZwgVDvbu

