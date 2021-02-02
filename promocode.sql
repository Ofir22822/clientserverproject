-- Table: public.promocode

-- DROP TABLE public.promocode;

CREATE TABLE public.promocode
(
    "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "PromoCode" text COLLATE pg_catalog."default",
    "Description" text COLLATE pg_catalog."default"
)
