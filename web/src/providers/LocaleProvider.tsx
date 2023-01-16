import { Context, createContext, useContext, useEffect, useState } from 'react'
import { useNuiEvent } from '../hooks/useNuiEvent'
import { fetchNui } from '../utils/fetchNui'

interface Locale {
  cannot_goback: string
  teleport_success: string
  no_marker: string
  command_tpm: string
  command_noclip: string
  command_openui: string
  command_weather_notfound: string
  ui_copy_coords: string
  ui_copied_coords: string
  ui_copy_name: string
  ui_copied_name: string
  ui_copy_hash: string
  ui_copied_hash: string
  ui_name: string
  ui_hash: string
  ui_coords: string
  ui_interior_id: string
  ui_current_room: string
  ui_teleport: string
  ui_not_in_interior: string
  ui_no_last_location: string
  ui_current_coords: string
  ui_set_coords: string
  ui_save_location: string
  ui_last_location: string
  ui_current_interior: string
  ui_quick_actions: string
  ui_clean_zone: string
  ui_clean_ped: string
  ui_upgrade_vehicle: string
  ui_repair_vehicle: string
  ui_delete_vehicle: string
  ui_set_sunny_day: string
  ui_spawn_vehicle: string
  ui_max_health: string
  ui_time_freeze: string
  ui_time_not_freeze: string
  ui_time: string
  ui_sync: string
  ui_freeze_time: string
  ui_weather: string
  ui_choose_weather: string
  ui_current_weather: string
  ui_freeze_weather: string
  ui_interior: string
  ui_room_count: string
  ui_portal_count: string
  ui_portals: string
  ui_infos: string
  ui_fill_portals: string
  ui_outline_portals: string
  ui_corcers_portals: string
  ui_flag: string
  ui_room_from: string
  ui_room_to: string
  ui_index: string
  ui_timecycle: string
  ui_object_spawner: string
  ui_locations: string
  ui_snap_to_ground: string
  ui_duplicate: string
  ui_no_location_found: string
  ui_goto: string
  ui_show_custom_locations: string
  ui_show_vanilla_locations: string
  ui_create_custom_location: string
  ui_search: string
  ui_rename: string
  ui_delete: string
  ui_vanilla: string
  ui_custom: string
  ui_peds: string
  ui_no_ped_found: string
  ui_set_by_name: string
  ui_set_ped: string
  ui_vehicles: string
  ui_spawn: string
  ui_spawn_by_name: string
  ui_no_vehicle_found: string
  ui_weapons: string
  ui_give_weapon_by_name: string
  ui_give_weapon: string
  ui_no_weapon_found: string
  ui_set_coords_as_string: string
  ui_set_coords_separate: string
  ui_confirm: string
  ui_cancel: string
  ui_location_name: string
  ui_create_location_description: string
  ui_add_entity: string
  ui_add_entity_description: string
  ui_delete_all_entities: string
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locales: Locale) => void
}

const LocaleCtx = createContext<LocaleContextValue | null>(null)

const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>({
    cannot_goback: '',
    teleport_success: '',
    no_marker: '',
    command_tpm: '',
    command_noclip: '',
    command_openui: '',
    command_weather_notfound: '',
    ui_copy_coords: '',
    ui_copied_coords: '',
    ui_copy_name: '',
    ui_copied_name: '',
    ui_copy_hash: '',
    ui_copied_hash: '',
    ui_name: '',
    ui_hash: '',
    ui_coords: '',
    ui_interior_id: '',
    ui_current_room: '',
    ui_teleport: '',
    ui_not_in_interior: '',
    ui_no_last_location: '',
    ui_current_coords: '',
    ui_set_coords: '',
    ui_save_location: '',
    ui_last_location: '',
    ui_current_interior: '',
    ui_quick_actions: '',
    ui_clean_zone: '',
    ui_clean_ped: '',
    ui_upgrade_vehicle: '',
    ui_repair_vehicle: '',
    ui_delete_vehicle: '',
    ui_set_sunny_day: '',
    ui_spawn_vehicle: '',
    ui_max_health: '',
    ui_time_freeze: '',
    ui_time_not_freeze: '',
    ui_time: '',
    ui_sync: '',
    ui_freeze_time: '',
    ui_weather: '',
    ui_choose_weather: '',
    ui_current_weather: '',
    ui_freeze_weather: '',
    ui_interior: '',
    ui_room_count: '',
    ui_portal_count: '',
    ui_portals: '',
    ui_infos: '',
    ui_fill_portals: '',
    ui_outline_portals: '',
    ui_corcers_portals: '',
    ui_flag: '',
    ui_room_from: '',
    ui_room_to: '',
    ui_index: '',
    ui_timecycle: '',
    ui_object_spawner: '',
    ui_locations: '',
    ui_snap_to_ground: '',
    ui_duplicate: '',
    ui_no_location_found: '',
    ui_goto: '',
    ui_show_custom_locations: '',
    ui_show_vanilla_locations: '',
    ui_create_custom_location: '',
    ui_search: '',
    ui_rename: '',
    ui_delete: '',
    ui_vanilla: '',
    ui_custom: '',
    ui_peds: '',
    ui_no_ped_found: '',
    ui_set_by_name: '',
    ui_set_ped: '',
    ui_vehicles: '',
    ui_spawn: '',
    ui_spawn_by_name: '',
    ui_no_vehicle_found: '',
    ui_weapons: '',
    ui_give_weapon_by_name: '',
    ui_give_weapon: '',
    ui_no_weapon_found: '',
    ui_set_coords_as_string: '',
    ui_set_coords_separate: '',
    ui_confirm: '',
    ui_cancel: '',
    ui_location_name: '',
    ui_create_location_description: '',
    ui_add_entity: '',
    ui_add_entity_description: '',
    ui_delete_all_entities: ''
  })

  useEffect(() => {
    fetchNui('loadLocale')
  }, [])

  useNuiEvent('setLocale', async (data: Locale) => setLocale(data))

  return <LocaleCtx.Provider value={{ locale, setLocale }}>{children}</LocaleCtx.Provider>
}

export default LocaleProvider

export const useLocales = () => useContext<LocaleContextValue>(LocaleCtx as Context<LocaleContextValue>)
