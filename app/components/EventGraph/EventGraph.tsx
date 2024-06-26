import { RootState } from 'app/services/root';
import { colors, spacing } from 'app/theme';
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, ListRenderItem, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';

interface EventGraphProps {
  events?: Record<string, string>;
}

interface DisplayItem {
  hour: number;
  event?: string;
  hasVerticalLine?: boolean;
}

const EventGraph: React.FC<EventGraphProps> = () => {
  const eventData = useSelector((state: RootState) => state.event.events);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 10;

  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    event: undefined,
    hasVerticalLine: false,
  }));

  const eventItems = Object.keys(eventData).map(timestamp => ({
    timestamp,
    event: eventData[timestamp],
  }));

  const generateDisplayItems = (events: { timestamp: string, event: string }[]): DisplayItem[] => {
    const displayItems: DisplayItem[] = [...hours];
    events.forEach((eventItem, index) => {
      const eventHour = new Date(parseInt(eventItem.timestamp)).getHours();
      displayItems[eventHour] = { ...displayItems[eventHour], event: eventItem.event };


      
     if(index===0)
        {
          displayItems[0].event = 'down';
          displayItems[0].hasVerticalLine = false;

        }
      // Check for vertical line condition with previous event
      if (index > 0) {
        const previousEvent = events[index - 1];
        const previousHour = new Date(parseInt(previousEvent.timestamp)).getHours();
  
        if ((previousEvent.event === 'up' && eventItem.event === 'down') ||
          (previousEvent.event === 'down' && eventItem.event === 'up')) {
          displayItems[previousHour].hasVerticalLine = true;
          displayItems[eventHour].event =  eventItem.event;
          // console.log(previousHour,eventHour,previousEvent.event,eventItem.event,'events transition')

        }
        displayItems[eventHour].event = displayItems[previousHour].event;
        displayItems[eventHour].hasVerticalLine = false;
      } 
      else{
        // Handle the very first event
        if (index > 0 && !eventItem.event) {
          const previousHour = eventHour - 1;
          displayItems[eventHour].event = displayItems[previousHour].event;
          displayItems[eventHour].hasVerticalLine = false;

        }
      }
    });
  
    return displayItems;
  };
  

  const displayItems = generateDisplayItems(eventItems);

  const renderItem: ListRenderItem<DisplayItem> = ({ item }) => {
    console.log(item,'days items')
    return(
    <View style={{ height: 200 }}>
      <Text>{item.hour}</Text>
      <View style={[$event, $up]}>
        <View style={$upContainer}>
          <View style={$highlight} />
          {item.event && item.event === 'up' && <Text>{item.event}</Text>}
        </View>
      </View>
      <View style={[$event, $down]}>
        <View style={$downContainer}>
          <View style={$highlight} />
          {item.event && item.event === 'down' && <Text>{item.event}</Text>}
        </View>
      </View>
      <View style={[item.event == 'up' ? $upLine : $downLine]} />
      {item.hasVerticalLine && (
        <View style={[item.event === 'up' && $verticalUpLine ,item.event === 'down' && $verticalDownLine]} />
      )}
    </View>
  )};

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
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: '#000',
  backgroundColor: colors.background,
};

const $up: ViewStyle = {
  height: '100%',
  alignSelf: 'flex-start',
  justifyContent: 'flex-start',
};

const $down: ViewStyle = {
  width: '100%',
  height: '100%',
  alignSelf: 'flex-end',
  justifyContent: 'flex-end',
};

const $upContainer: ViewStyle = {
  flex: 1,
  borderWidth: 0.25,
};

const $downContainer: ViewStyle = {
  borderWidth: 0.25,
  flex: 1,
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

const $verticalUpLine: ViewStyle = {
  position: 'absolute',
  top: '25%',
  minWidth: '100%',
  borderLeftWidth: 2,
  borderRightWidth: 2,
  borderColor: 'blue',
  height: '50%',
};

const $verticalDownLine: ViewStyle = {
  position: 'absolute',
  bottom: '25%',
  minWidth: '100%',
  borderLeftWidth: 2,
  borderColor: 'blue',
  borderRightWidth: 2,
  height: '50%',
};

export default EventGraph;
