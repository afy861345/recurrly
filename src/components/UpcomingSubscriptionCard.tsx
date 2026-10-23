import { formatCurrency } from "@/lib/utils";
import { router } from "expo-router";
import { Image, Text, View, TouchableOpacity } from 'react-native';

const UpcomingSubscriptionCard = ({ id,name, price, daysLeft, icon, currency }: UpcomingSubscription) => {
    return (
        <TouchableOpacity onPress={() => router.push(`/subscription/${id}`)}
        className="upcoming-card">
            <View className="upcoming-row">
                <Image source={icon} className="upcoming-icon" />
                <View>
                    <Text className="upcoming-price">{formatCurrency(price, currency)}</Text>
                    <Text className="upcoming-meta" numberOfLines={1}>
                        {daysLeft > 1 ? `${daysLeft} days left` : 'Last day'}
                    </Text>
                </View>
            </View>

            <Text className="upcoming-name" numberOfLines={1}>{name}</Text>
        </TouchableOpacity>
    )
}
export default UpcomingSubscriptionCard
