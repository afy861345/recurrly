import { Link, useLocalSearchParams } from "expo-router";
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { posthog } from '../../../lib/posthog';

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    
    useEffect(() => {
        // Only capture if id is valid
        if (id && typeof id === 'string' && id.trim()) {
            posthog?.capture('subscription_details_viewed', { subscription_id: id });
        }
    }, [id, posthog]);

    return (
        <View>
            <Text>Subscription Details: {id}</Text>
            <Link href="/">Go back</Link>
        </View>
    )
}

export default SubscriptionDetails