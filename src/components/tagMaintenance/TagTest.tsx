import DragDropEntry, { TScrollFunctions } from "@/components/common/DragAndSort/DragDropEntry";
import DragItem from "@/components/common/DragAndSort/DragItem";
import { sortArray } from "@/components/common/DragAndSort/helperFunctions";

export type ItemType = {
  id: number | string;
  name: string;
  pos: number;
};
const items = [
  { id: "a", name: "Coconut Milk", pos: 0 },
  { id: "b", name: "Lettuce", pos: 1 },
  { id: "c", name: "Walnuts", pos: 2 },
  { id: "d", name: "Chips", pos: 3 },
  // { id: "e", name: "Ice Cream", pos: 4 },
  // { id: "f", name: "Carrots", pos: 5 },
  // { id: "g", name: "Onions", pos: 6 },
  // { id: "h", name: "Cheese", pos: 7 },
  // { id: "i", name: "Frozen Dinners", pos: 8 },
  // { id: "j", name: "Yogurt", pos: 9 },
  // { id: "k", name: "Kombucha", pos: 10 },
  // { id: "l", name: "Lemons", pos: 11 },
  // { id: "m", name: "Bread", pos: 12 },
];

export default function TagContainer() {
  const updateItemList = (sortArray) => {
    console.log("Updating Items List");
  };
  return (
    <DragDropEntry
      scrollStyles={{ width: "100%", height: "30%", borderWidth: 1, borderColor: "#aaa" }}
      updatePositions={(positions) => updateItemList(sortArray<ItemType>(positions, items, "pos"))}
      // getScrollFunctions={(functionObj) => setScrollFunctions(functionObj)}
      itemHeight={50}
      handlePosition="left"
      // handle={AltHandle} // This is optional.  leave out if you want the default handle
      enableDragIndicator={true}
    >
      {items.map((item, idx) => {
        return (
          <DragItem
            key={item.id}
            name={item.name}
            id={item.id}
            // onRemoveItem={() => removeItemById(item.id)}
            firstItem={idx === 0 ? true : false}
          />
        );
      })}
    </DragDropEntry>
  );
}
