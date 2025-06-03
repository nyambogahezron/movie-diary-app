import Colors from '@/constants/Colors';
import { Bookmark, ChevronRight, Eye, List } from 'lucide-react-native';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type List = {
	id: string;
	name: string;
	count: number;
	icon: React.ReactNode;
};
export default function ListsTab() {
	const lists: List[] = [
		{
			id: '1',
			name: 'Watchlist',
			count: 12,
			icon: <Bookmark size={20} color={Colors.primary[500]} />,
		},
		{
			id: '2',
			name: 'Watched',
			count: 45,
			icon: <Eye size={20} color={Colors.success[500]} />,
		},
		{
			id: '3',
			name: 'Custom Lists',
			count: 3,
			icon: <List size={20} color={Colors.accent[500]} />,
		},
	];

	const renderListItem = ({ item }: { item: List }) => (
		<TouchableOpacity style={styles.listItem}>
			<View style={styles.listItemContent}>
				<View style={styles.listIconContainer}>{item.icon}</View>
				<View style={styles.listItemText}>
					<Text style={styles.listName}>{item.name}</Text>
					<Text style={styles.listCount}>{item.count} items</Text>
				</View>
			</View>
			<ChevronRight size={20} color={Colors.neutral[400]} />
		</TouchableOpacity>
	);

	return (
		<FlatList
			data={lists}
			renderItem={renderListItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.tabContentContainer}
			showsVerticalScrollIndicator={false}
		/>
	);
}

const styles = StyleSheet.create({
	tabContentContainer: {
		padding: 16,
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: Colors.neutral[900],
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	listItemContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	listIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.neutral[800],
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	listItemText: {
		flex: 1,
	},
	listName: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[100],
		marginBottom: 4,
	},
	listCount: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[500],
	},
});
