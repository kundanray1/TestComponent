import { RootState } from 'app/services/root';
import { colors, spacing } from 'app/theme';
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, ListRenderItem, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';

interface EventGraphProps {
  events?: Record<string, string>;
}

interface EventItem {
  timestamp: string;
  event: string;
}

interface DisplayItem {
  hour: number;
  event?: string;
  isContinuation?: boolean;
}

const EventGraph: React.FC<EventGraphProps> = () => {
  const eventData = useSelector((state: RootState) => state.event.events);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 10;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const eventItems: EventItem[] = Object.keys(eventData).map((timestamp) => ({
    timestamp,
    event: eventData[timestamp],
  }));

  const generateDisplayItems = (events: EventItem[]): DisplayItem[] => {
    const displayItems: DisplayItem[] = hours.map(hour => ({ hour }));

    events.forEach((eventItem) => {
      const eventHour = new Date(parseInt(eventItem.timestamp)).getHours();
      displayItems[eventHour] = { hour: eventHour, event: eventItem.event };

      if (eventItem.event === 'up') {
        for (let i = eventHour + 1; i < 24; i++) {
          if (displayItems[i].event === 'down') break;
          displayItems[i].isContinuation = true;
        }
      }
    });

    return displayItems;
  };

  const displayItems = generateDisplayItems(eventItems);

  const renderItem: ListRenderItem<DisplayItem> = ({ item }) => (
    <View style={{height:200}}>
<Text>{item.hour}</Text>
    <View style={[$event, item.event === 'up' ? $up : $down]}>
      <View
       style={ $downContainer}
      >
        <View style={$highlight} />
        {item.event && <Text>{item.event}</Text>}
        {/* {!item.event && <Text>{item.hour}:00</Text>} */}
      </View>
      <View style={item.event === 'up' ? $upLine : $downLine} />
      {item.isContinuation && <View style={item.event === 'up' ? $upLine : $downLine} />}
    </View>
    </View>

  );

  const keyExtractor = useCallback((item: DisplayItem, index: number) => `${item.hour}-${index}`, []);

  const getItemLayout = useCallback((_item: ArrayLike<DisplayItem> | null | undefined, index: number) => ({
    length: 100,
    offset: 100 * index,
    index,
  }), []);

  const handleEndReached = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <View style={$container}>
      <FlatList
        data={displayItems.slice(0, (currentPage + 1) * pageSize)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        onEndReached={handleEndReached}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  flexGrow: 10,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.palette.accent200,
};

const $event: ViewStyle = {
  flex: 1,
  height: 100,
  alignSelf: 'center',
  justifyContent:'center',
  alignItems: 'center',
  borderColor: '#000',
  backgroundColor: colors.background,
};

const $up: ViewStyle = {
  // width: '100%',
  borderWidth:0.5,

  height: '50%',
  alignSelf: 'flex-start',
  justifyContent: 'flex-start',
};

const $down: ViewStyle = {
  width: '100%',
  height: '50%',
  alignSelf: 'flex-end',
  justifyContent: 'flex-end',
  borderWidth:0.5,
};

const $upContainer: ViewStyle = {
//  borderWidth:0.5,
  flex: 0.5,
  // borderColor: 'blue',
};

const $downContainer: ViewStyle = {
  borderWidth:0.5,

  // borderColor: 'blue',
  flex: 0.5,
};

const $highlight: ViewStyle = {
  minWidth: '100%',
  width: 100,
};

const $upLine: ViewStyle = {
  position: 'absolute',
  top: '25%',
  left: 0,
  right: 0,
  height: 2,
  backgroundColor: 'blue',
};

const $downLine: ViewStyle = {
  position: 'absolute',
  bottom: '25%',
  left: 0,
  right: 0,
  height: 2,
  backgroundColor: 'blue',
};

export default EventGraph;
