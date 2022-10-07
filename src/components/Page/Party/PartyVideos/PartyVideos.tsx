import { FC } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import classNames from "classnames/bind";
import styles from "./PartyVideos.module.css";
import { IconButton } from "components/Icon/IconButton";
import { IconPlus } from "components/Icon/IconPlus";
const cx = classNames.bind(styles);

interface IPartyVideosProps {
  videos?: string[] | null;
  currentVideoId?: string | null;
  onSortVideos: (videos: string[]) => void;
  onRemoveVideo:(videoId: string) => void;
}

const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const PartyVideos: FC<IPartyVideosProps> = ({
  currentVideoId,
  videos,
  onSortVideos,
  onRemoveVideo,
}) => {
  const onDragEnd = (result: DropResult) => {
    if (!videos) return;
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      videos,
      result.source.index,
      result.destination.index
    );

    console.log(items);
    onSortVideos(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cx("party__videos")}
          >
            {videos?.map((videoId, index) => (
              <Draggable
                key={`i-${videoId}-${index}`}
                draggableId={`i-${videoId}-${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                    className={cx("videos__item", {
                      playing: videoId === currentVideoId,
                    })}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    />
                    {videoId === currentVideoId && <IconButton />}
                    <a onClick={() => onRemoveVideo(videoId)}>
                      <IconPlus />
                    </a>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
