import { Alert, AlertIcon } from "@chakra-ui/react"

export default function NoUser() {
    return (<Alert status="error">
        <AlertIcon />
        User not Logged in
      </Alert>)
}