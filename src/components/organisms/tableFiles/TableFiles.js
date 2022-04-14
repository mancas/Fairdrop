import React, { useState } from 'react'

import { Box } from '../../atoms/box/Box'
import { useMediaQuery } from '../../../hooks/useMediaQuery/useMediaQuery'
import { DEVICE_SIZE } from '../../../theme/theme'
import { TableDesktop } from './TableDesktop'
import { TableMobile } from './TableMobile'
import { FileDetailsAnimated } from './FileDetailsAnimated'

export const TableFiles = ({ className, sortedMessages, honestInboxRegex, hideFrom, onClick }) => {
  const [fileDetails, setFileDetails] = useState(null)
  const minTabletMediaQuery = useMediaQuery(`(min-width: ${DEVICE_SIZE.TABLET})`)

  const handleClickFile = (details) => {
    setFileDetails(details)
    onClick?.(details)
  }

  const handleExitedFile = () => {
    setFileDetails(null)
  }

  return (
    <Box className={className} fitWidth>
      {minTabletMediaQuery ? (
        <TableDesktop
          sortedMessages={sortedMessages}
          honestInboxRegex={honestInboxRegex}
          hideFrom={hideFrom}
          onClick={handleClickFile}
        />
      ) : (
        <TableMobile
          sortedMessages={sortedMessages}
          honestInboxRegex={honestInboxRegex}
          hideFrom={hideFrom}
          onClick={handleClickFile}
        />
      )}

      <FileDetailsAnimated show={!!fileDetails} fileDetails={fileDetails} onExited={handleExitedFile} />
    </Box>
  )
}
