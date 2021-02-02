-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Name" text COLLATE pg_catalog."default",
    "FamilyName" text COLLATE pg_catalog."default",
    "Email" text COLLATE pg_catalog."default",
    "PromoCode" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "PhoneNumber" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "Country" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "City" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "Street" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "ZipCode" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "Password" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "Spare1" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "Spare2" text COLLATE pg_catalog."default" DEFAULT ''::text,
    "Spare3" integer,
    "Spare4" integer,
    CONSTRAINT users_pkey PRIMARY KEY ("ID"),
    CONSTRAINT "Email_unique" UNIQUE ("Email")
        INCLUDE("Email")
)

