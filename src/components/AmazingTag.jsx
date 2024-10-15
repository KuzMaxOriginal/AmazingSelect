import {useSortable} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import Chip from "@mui/material/Chip"

export default function AmazingTag(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: props.value.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Chip
        sx={{ mr: 0.5, mb: 0.25, mt: 0.25 }}
        key={props.value?.label}
        label={props.value?.label}
      />
    </div>
  )
};
