import ListHeading from '@/components/ListHeading';
import SubscriptionCard from '@/components/SubscriptionCard';
import UpcomingSubscriptionCard from '@/components/UpcomingSubscriptionCard';
import { HOME_BALANCE } from '@/constants/data';
import images from '@/constants/images';
import { formatCurrency } from '@/lib/utils';
import { useUser } from '@clerk/expo';
import dayjs from 'dayjs';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { posthog } from '../../lib/posthog';

import CreateSubscriptionModal from '@/components/CreateSubscriptionModal';
import { icons } from '@/constants/icons';
import { useSubscriptionStore } from '@/lib/subscriptionStore';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeArea } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeArea);
const Index = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { subscriptions, addSubscription } = useSubscriptionStore();

    const { user } = useUser();
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const handleSubscriptionPress = (item: Subscription) => {
        const isExpanded = expandedSubscriptionId !== item.id;
        posthog?.capture('subscription_details_toggled', {
            subscription_id: item.id,
            is_expanded: isExpanded,
        });
        setExpandedSubscriptionId(isExpanded ? item.id : null);
    };
    const handleCreateSubscription = (newSubscription: Subscription) => {
        addSubscription(newSubscription);
        posthog?.capture('subscription_created', {
            subscription_name: newSubscription.name,
            subscription_price: newSubscription.price,
        });
    };
    // Get upcoming subscriptions (active subscriptions with renewal date within next 7 days)
    const upcomingSubscriptions = useMemo(() => {
        const now = dayjs();
        const nextWeek = now.add(7, 'days');

        return subscriptions
            .filter(sub =>
                sub.status === 'active' &&
                dayjs(sub.renewalDate).isAfter(now) &&
                dayjs(sub.renewalDate).isBefore(nextWeek)
            )
            .sort((a, b) =>
                dayjs(a.renewalDate).diff(dayjs(b.renewalDate))
            )
            .map(sub => ({
                ...sub,
                daysLeft: dayjs(sub.renewalDate).diff(now, 'day')
            }));
    }, [subscriptions]);
    // Get user display name: firstName, fullName, or email
    const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';
    return (
        <SafeAreaView className='flex-1 bg-background p-5'>

            <FlatList
                data={subscriptions}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => handleSubscriptionPress(item)}
                    />
                )}
                keyExtractor={(item) => item.id}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className='h-4' />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => <Text className='home-empty-state'>No supscriptions yet</Text>}

                ListHeaderComponent={() => (
                    <>
                        <View className='home-header'>
                            <View className='home-user'>
                                <Image source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                    className='home-avatar' />
                                <Text className="home-user-name">{displayName}</Text>
                            </View>
                            <Pressable onPress={() => setIsModalVisible(true)}>
                                <Image source={icons.add} className="home-add-icon" />
                            </Pressable>
                        </View>
                        <View className='home-balance-card'>
                            <Text className='home-balance-label'>Balance</Text>
                            <View className='home-balance-row'>
                                <Text className='home-balance-amount'>{formatCurrency(HOME_BALANCE.amount)}</Text>

                                <Text className='home-balance-date'>{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}</Text>
                            </View>
                        </View>
                        <View>
                            <ListHeading title='Upcoming' />
                            <FlatList data={upcomingSubscriptions}
                                renderItem={({ item }) => (
                                    <UpcomingSubscriptionCard {...item} />
                                )}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={() => (
                                    <Text className='home-empty-state'>No Upcoming renewals yet</Text>
                                )}
                            />
                            <ListHeading title='All Subscriptions' />
                        </View>
                    </>
                )}
                contentContainerClassName='pb-30'
            />
            <CreateSubscriptionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={(newSubscription) => { handleCreateSubscription(newSubscription) }}
            />


        </SafeAreaView>
    )
}

export default Index