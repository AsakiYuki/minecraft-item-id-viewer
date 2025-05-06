import { BindingName, UI, Vanilla } from "jsonui-scripting";

const version = process.argv.find(arg => arg.startsWith("--version="))?.split("=")[1] || "stable";

interface Items {
    name: string,
    id: number,
    id_aux: number
}

interface ItemList {
    version: string,
    length: number,
    items: Items[]
}

(async () => {
    const propertyBags: {
        [key: `#item_id:${number}`]: string
    } = {}

    if (["stable", "preview"].includes(version)) {
        const item_datas = await fetch("https://asakiyuki.com/api/minecraft/items/id").then(r => r.json() as Promise<ItemList>);
        const item_list = item_datas.items;
        for (const item of item_list) propertyBags[`#item_id:${item.id}`] = item.name;
    }

    const highlightSlot = Vanilla.common.highlightSlotPanel_highlight_hoverText({
        property_bag: propertyBags
    });

    const bindingName = "$hover_text_binding_name" as any;
    const bindingCollectionName = "$item_collection_name" as any;

    highlightSlot.override.addBindings([
        {
            binding_name: bindingName,
            binding_name_override: "#item_text",
            binding_collection_name: bindingCollectionName
        },
        {
            binding_name: BindingName.ItemIdAux,
            binding_name_override: "#id_aux",
            binding_collection_name: bindingCollectionName
        },
        {
            source_property_name: `[ #id_aux != -1 ]`,
            target_property_name: BindingName.Visible
        },
        {
            source_property_name: "[ '#item_id:{ #id_aux / 65536 }' ]",
            target_property_name: "#id_name"
        },
        {
            source_property_name: ["'{ #item_text }\n§7§o{ #id_name }§z' - '\n§7§o§z'"],
            target_property_name: "#hover_text"
        }
    ])
})();