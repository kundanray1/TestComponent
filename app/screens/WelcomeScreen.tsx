import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {  ViewStyle } from "react-native"


import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import MyComponent from "app/components/MyComponent"
import { Screen } from "app/components"
import { useQuery } from "@tanstack/react-query"
import { QueryKey } from "app/utils/queryKeys"
import ExampleService from "app/services/api/example.api"


interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
) {


  const {
    data: MessageData,
    isLoading: _isMessageLoading,
    refetch: refetchMessageData,
    isRefetching: isRefetchingMessageData,
  } = useQuery({
    queryKey: [QueryKey.TODO_ITEMS],
    queryFn: async () => {const res= await ExampleService.getTodos()
      return res
    },
    initialData:[]

  })

  return (
    <Screen style={$container} safeAreaEdges={['top']} >
<MyComponent data={MessageData}/>
    </Screen>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal:spacing.sm
}

