SELECT
  wohnstandorte_tabelle.Adresse AS Adresse,
  wohnstandorte_tabelle.geom AS geom,
  zbez.BEZ AS Bezirk,
  zbez.OBJ_BAUP_2001BIS AS Anzahl_Gebaeude_Bauperiode_ab_2001,
  zbez.WHG_RECHTSVERH_HAUPTM AS Anzahl_Mietwohnungen,
  zbez.WHG_RECHTSVERH_WOHNEIG AS Anzahl_Eigentumswohnungen
FROM
  wohnstandorte as wohnstandorte_tabelle
JOIN
  g07_2014_p_zaehlbezirke_pop_geb_wohn as zbez
ON ST_Contains(zbez.Geometry, wohnstandorte_tabelle.geom)
