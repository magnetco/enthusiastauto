import type { StructureResolver } from "sanity/desk";

/**
 * Sanity Studio Structure Configuration
 * Customizes the Studio desk organization for Enthusiast Auto
 * Story 3.6: Custom desk structure with filtered views
 * https://www.sanity.io/docs/structure-builder-cheat-sheet
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Enthusiast Auto Content")
    .items([
      // Current Inventory Section
      S.listItem()
        .title("Current Inventory")
        .icon(() => "🚗")
        .child(
          S.documentList()
            .title("Current Inventory")
            .filter('_type == "vehicle" && status == "current"')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
            .menuItems(S.documentTypeList("vehicle").getMenuItems())
        ),

      // Sold Vehicles Section
      S.listItem()
        .title("Sold Vehicles")
        .icon(() => "✅")
        .child(
          S.documentList()
            .title("Sold Vehicles")
            .filter('_type == "vehicle" && status == "sold"')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
            .menuItems(S.documentTypeList("vehicle").getMenuItems())
        ),

      // Draft Vehicles Section
      S.listItem()
        .title("Drafts")
        .icon(() => "📝")
        .child(
          S.documentList()
            .title("Draft Vehicles")
            .filter('_type == "vehicle" && _id in path("drafts.**")')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
            .menuItems(S.documentTypeList("vehicle").getMenuItems())
        ),

      // Divider
      S.divider(),

      // All Vehicles (unfiltered)
      S.listItem()
        .title("All Vehicles")
        .icon(() => "📋")
        .child(
          S.documentList()
            .title("All Vehicles")
            .filter('_type == "vehicle"')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
        ),

      // Divider
      S.divider(),

      // Other document types (if any are added later)
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== "vehicle"
      ),
    ]);
