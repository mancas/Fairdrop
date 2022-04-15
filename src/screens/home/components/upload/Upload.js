// Copyright 2019 The FairDataSociety Authors
// This file is part of the FairDataSociety library.
//
// The FairDataSociety library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The FairDataSociety library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the FairDataSociety library. If not, see <http://www.gnu.org/licenses/>.

import React, { memo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'
import { Box, Button, Tab, Tabs, Text } from '../../../../components'
import { DropArea } from '../../../../components/molecules/dropArea/DropArea'
import { FileInput } from '../../../../components/molecules/fileInput/FileInput'
import { parameters } from '../../../../config/parameters'
import { FILE_UPLOAD_TYPES, useFileManager } from '../../../../hooks/fileManager/useFileManager'

const Container = styled(Box)`
  width: 100%;
  height: 100%;
`

const DropAreaContainer = styled(Box)`
  width: 100%;
`

const TabContent = styled(Box)`
  margin: 16px 0;
  width: 100%;
`

const ActionButton = styled(Button)`
  margin-top: 8px;
`

const noop = () => {}

export const Upload = memo(({ ...props }) => {
  const [{ files }, { setFiles, resetFileManager }] = useFileManager()
  const { getRootProps, isDragActive } = useDropzone({ onDrop: noop })

  const checkFileSize = useCallback((file) => {
    const hasEasterEggEnabled = parseInt(localStorage.getItem('hasEnabledMaxFileSizeEasterEgg')) === 1
    const maxFileSize = hasEasterEggEnabled ? parameters.easterEggMaxFileSize : parameters.maxFileSize
    const isValidSize = file.size <= maxFileSize
    if (!isValidSize) {
      toast.error(`🐝 Sorry but the file size is restricted to ${maxFileSize / (1024 * 1024)}mb`)
    }
    return isValidSize
  }, [])

  const handleClean = useCallback(() => {
    resetFileManager?.()
  }, [resetFileManager])

  const handleQuickFileDrop = useCallback((file) => {
    console.info(file)
    if (!checkFileSize(file)) {
      return
    }
    setFiles({ type: FILE_UPLOAD_TYPES.QUICK, files: [file] })
  }, [])

  const handleEncryptedFileDrop = useCallback((file) => {
    if (!checkFileSize(file)) {
      return
    }
    setFiles({ type: FILE_UPLOAD_TYPES.ENCRYPTED, files: [file] })
  }, [])

  return (
    <Container direction="column" vAlign="center" {...getRootProps()}>
      {isDragActive && (
        <DropAreaContainer gap="16px" direction="column" vAlign="center" hAlign="center">
          <DropArea
            icon="folder"
            headline="Quick transfer"
            description="Drop your file here"
            onDrop={handleQuickFileDrop}
          />

          <DropArea
            icon="folderEncrypted"
            headline="Encrypted transfer"
            description="Drop your file here"
            onDrop={handleEncryptedFileDrop}
          />
        </DropAreaContainer>
      )}

      {!isDragActive && (
        <Tabs>
          <Tab>Quick transfer</Tab>
          <Tab>Encrypted transfer</Tab>

          <TabContent direction="column" gap="16px">
            <Text size="m" weight="300" variant="black">
              Send files to anyone. Quick and easy
            </Text>

            <FileInput file={files?.[0]} onFileChange={handleQuickFileDrop} onClean={handleClean} />

            <Text size="m" weight="300" variant="black">
              Or simply drop your file here
            </Text>

            <ActionButton variant="primary">Get transfer link</ActionButton>
          </TabContent>

          <TabContent direction="column" gap="16px">
            <Text size="m" weight="300" variant="black">
              Send any file to any Fairdrop user in a more secure way. You must log in first.
            </Text>
          </TabContent>
        </Tabs>
      )}
    </Container>
  )
})

Upload.displayName = 'Upload'
