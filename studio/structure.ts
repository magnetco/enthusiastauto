import type { StructureResolver } from "sanity/structure";
import {
  DocumentIcon,
  CheckmarkCircleIcon,
  EditIcon,
  DocumentsIcon,
  DocumentTextIcon,
  WrenchIcon,
  ComponentIcon,
} from "@sanity/icons";

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
        .icon(DocumentIcon)
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
        .icon(CheckmarkCircleIcon)
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
        .icon(EditIcon)
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
        .icon(DocumentsIcon)
        .child(
          S.documentList()
            .title("All Vehicles")
            .filter('_type == "vehicle"')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
        ),

      // Divider
      S.divider(),

      // Blog Posts
      S.listItem()
        .title("Blog Post")
        .icon(DocumentTextIcon)
        .child(S.documentTypeList("post").title("Blog Posts")),

      // Services
      S.listItem()
        .title("Service")
        .icon(WrenchIcon)
        .child(
          S.documentTypeList("service")
            .title("Services")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }])
        ),

      // Pages
      S.listItem()
        .title("Page")
        .icon(ComponentIcon)
        .child(
          S.documentTypeList("page")
            .title("Pages")
            .defaultOrdering([{ field: "pageType", direction: "asc" }])
        ),
    ]);
