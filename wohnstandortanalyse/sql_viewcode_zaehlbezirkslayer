SELECT
  g07_2014_p_zaehlbezirke_pop_geb_wohn.zbez_long,
  zbez.Geometry,
  zbez.zbez_long || ' zbez_nummer' AS name,
  '%column%' AS variable,
  %column% AS data,
  (%column% - stats.avg) / stats.stddev AS normalized_data
FROM (
  SELECT
    avg(%column%) as avg,
    stddev_samp(%column%) as stddev
  FROM g07_2014_p_zaehlbezirke_pop_geb_wohn
) AS stats, g07_2014_p_zaehlbezirke_pop_geb_wohn
JOIN g07_2014_p_zaehlbezirke AS zbez USING (zbez_long)
