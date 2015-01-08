SELECT
  join2.Adresse as Adresse,
  join2.Anzahl_Haltestellen_in_1000m as Anzahl_Haltestellen_in_1000m,
  join2.ÖV_Linien as ÖV_Linien,
  zbez.OBJ_ANZGESCHO_11BIS as Anzahl_Gebaeude_ueber_11_Stockwerke,
  zbez.OBJ_BAUP_2001BIS as Anzahl_Gebaeude_ab_2001_erbaut,
  join2.geom as geom
FROM(  
  SELECT
    join1.Adresse as Adresse,
    join1.geom as geom,
    join1.Anzahl_Haltestellen_in_1000m as Anzahl_Haltestellen_in_1000m,
    voronoi.HLINIEN as ÖV_Linien
  FROM(
    SELECT 
      buffer_table.Adresse AS Adresse,
      buffer_table.geom AS geom,
      count(haltestellen_tabelle.BEZEICHNUN) AS Anzahl_Haltestellen_in_1000m
    FROM(
      SELECT
        wohnstandorte_tab.Adresse AS Adresse,
        wohnstandorte_tab.geom AS geom,
        ST_Buffer(Transform(wohnstandorte_tab.geom, 31259), 1000) AS buffer_geom
      FROM 
        wohnstandorte AS wohnstandorte_tab) AS buffer_table
    JOIN 
      g07_2014_p_haltestellen AS haltestellen_tabelle
    ON ST_Contains(buffer_table.buffer_geom, Transform(haltestellen_tabelle.Geometry, 31259))
    GROUP BY buffer_table.Adresse) AS join1
  JOIN
    HighRankStopsVoronoi_bez AS voronoi
  ON ST_CONTAINS(voronoi.Geometry, join1.geom)) AS join2
JOIN
  g07_2014_p_zaehlbezirke_pop_geb_wohn AS zbez
ON ST_CONTAINS(zbez.Geometry, join2.geom)
