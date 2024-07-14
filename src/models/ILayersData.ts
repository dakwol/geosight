export interface ILayersData{
    created_at: string;
    creator: number | null;
    description: string;
    id: number | null;
    is_active: boolean;
    line_color_palette: {}
    line_opacity: string;
    line_size: number | null;
    line_solid_color: string;
    line_style: string;
    line_value_field_name: number | null;
    maps: [number]
    name: string;
    point_color_palette: {}
    point_opacity: string;
    point_radius: number | null;
    point_solid_color: string;
    point_value_field_name: number | null;
    polygon_border_color: string;
    polygon_border_opacity: string;
    polygon_border_size: number | null;
    polygon_border_style: string;
    polygon_color_palette: {}
    polygon_label: number | null;
    polygon_label_font: string;
    polygon_label_font_color: string;
    polygon_label_font_opacity: string;
    polygon_label_font_size: number | null;
    polygon_label_font_style: string;
    polygon_opacity: string;
    polygon_solid_color: string;
    polygon_value_field_name:number | null;
    updated_at:string;
}