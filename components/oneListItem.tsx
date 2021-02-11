import { useQuery } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

import {
  ItemType,
  BundleObject,
  FeedObject,
  SelectedFeedState,
  BadgeFieldName,
  ActionType,
} from "../utils/types";
import { DoubleArrowDown, DoubleArrowRight, WaitingClock } from "./svg";
import { useFetchUser } from "../utils/user";
import { BadgeList } from "./badgeList";

export const OneListItem = ({
  item,
  type,
  selected,
  setSelected,
  useSelected = false,
  allowEdits = false,
}: {
  type: ItemType;
  item: FeedObject | BundleObject;
  selected?: SelectedFeedState;
  setSelected?: Dispatch<SetStateAction<SelectedFeedState>>;
  useSelected?: boolean;
  allowEdits?: boolean;
}) => {
  const isFeed = type === ItemType.FeedType;
  const isSelected = useSelected && selected && selected.id === item.id;
  const { user, loading } = useFetchUser();

  if (loading) {
    return <WaitingClock className="h-10 w-10 text-gray-500 m-auto" />;
  }

  return (
    <Link href={`\${isFeed ? 'feed' : 'bundle'}/${item.id}`}>
      <div>
        <div className="cursor-pointer grid grid-cols-6 p-4 rounded-lg border-b-4 border-l-4 border-r-4">
          <div className="col-span-4">
            <h4 className="font-bold">{item.name}</h4>
            {!isFeed ? <p>{item["description"]}</p> : null}
          </div>
          <div className="col-span-2 flex justify-end">
            <p>actions</p>
          </div>
          <div className="flex col-span-6 py-0 space-x-2">
            {item.author ? <p>profile pic</p> : null}
          </div>
          <div className="col-span-6 py-2">
            <h3>Tags</h3>
            <div className="grid grid-cols-3 gap-2">
              <BadgeList
                fieldName={BadgeFieldName.tags}
                action={ActionType.NONE}
                item={item}
              />
            </div>
          </div>
          <div className="col-span-6 py-2">
            <h3>{isFeed ? "Bundles" : "Feeds"}</h3>
            <div className="grid grid-cols-3 gap-2">
              <p>child items....</p>
            </div>
          </div>
        </div>
        {useSelected ? (
          <>
            {isSelected ? (
              <p
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={`flex routed-lg rounded-t-none align-middle ${
                  isSelected
                    ? `bg-${isFeed ? "green" : "purple"}-400`
                    : `bg-gray-300`
                }
                    p-4 z-10 text-white cursor-pointer`}
              >
                <DoubleArrowDown className="h-5 w-5 text-white-500 mr-2 mt-1" />
                {` Hide ${isFeed ? "Feed" : "Bundle"} Articles`}
              </p>
            ) : (
              <p
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({
                    id: item.id,
                    feeds: isFeed ? [item] : item["feeds"],
                    editMode: false,
                    newMode: false,
                  });
                }}
                // done to hear
                className={`flex routed-lg rounded-t-none align-middle ${
                  isSelected
                    ? `bg-${isFeed ? "green" : "purple"}-400`
                    : `bg-gray-300`
                }
                    p-4 z-10 text-white cursor-pointer`}
              >
                <DoubleArrowRight className="h-5 w-5 text-white-500 mr-2 mt-1" />
                {` Show ${isFeed ? "Feed" : "Bundle"} Articles`}
              </p>
            )}
          </>
        ) : null}
      </div>
    </Link>
  );
};
