import * as React from "react"
import useInfiniteScroll from 'react-infinite-scroll-hook'
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import {
  arrayMove,
} from "@dnd-kit/sortable"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import AmazingTags from "./AmazingTags"
import {useReducer, useState} from "react"
import {updateSelectedOptions} from "../common/api.js"
import {debounce} from "@mui/material"
import {styled} from "@mui/material/styles"
import useLoadOptions from "../hooks/useLoadOptions.js"

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const SENTRY = 'sentry'

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: 500,
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 4rem)',
  },
}))

export default function AmazingSelect(props) {
  const isInitialized = React.useRef(false)
  const [searchQuery, setSearchQuery] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [options, setOptions] = React.useState([])
  const [values, setValues] = React.useState([])

  const [page, dispatchPage] = useReducer((page, action) => {
    if (action === 'increment') {
      return page + 1
    }

    if (action === 'reset') {
      return 1
    }
  }, 1)

  const loadOptions = useLoadOptions({
    dispatchPage,
    setOptions,
    page,
    setHasNextPage,
    setValues,
    searchQuery,
  })

  const updateSelectedValue = (newValue) => {
    updateSelectedOptions((newValue || values).map(({ id }) => id))
  }

  React.useEffect(() => {
    if (!isInitialized.current) {
      loadOptions(true)
      isInitialized.current = true
    }
  }, [])

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    hasNextPage,
    // disabled: !open,
    onLoadMore: () => loadOptions(false),
  })

  const onTagMove = (active, over) => {
    setValues((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      const result = arrayMove(items, oldIndex, newIndex)

      updateSelectedValue(result)
      return result
    })
  }

  // const onTagDelete = ({ id }) => {
  //   setValues((items) => {
  //     const result = items.filter(item => item.id !== id);
  //
  //     updateSelectedValue(result);
  //     return result;
  //   });
  // }

  const onSearch = debounce((e) => {
    const { value } = e.target

    loadOptions(false, true, value)
    setSearchQuery(value || null)
  }, 300)

  return (
      <StyledAutocomplete
        multiple
        disableCloseOnSelect
        onChange={(changedValues, value) => {
          setValues(value)
          updateSelectedValue(value)
        }}
        noOptionsText={props.noOptionsText}
        options={options}
        value={values}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            onChange={onSearch}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={(filterOptions) => {
          if (hasNextPage) {
            filterOptions.push(SENTRY)
          }

          return filterOptions
        }}
        renderOption={({ key, ...optionProps }, option, { selected }) => {
          if (option === SENTRY) {
            return (
              <li key={key} ref={sentryRef} style={{ textAlign: 'center' }}>
                {hasNextPage ? props.loading : ''}
              </li>
            )
          }

          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label}
            </li>
          )
        }}
        renderTags={(value) => (
          <AmazingTags
            values={value}
            onMove={onTagMove}
          />
        )}
        ListboxProps={{ ref: rootRef }}
      />
  )
}