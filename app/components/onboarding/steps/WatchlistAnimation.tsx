import { CheckCircle, Clock, Film } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';

export default function WatchlistAnimation() {
	const watchlistItems = [
		{ title: 'Inception', color: '#2563EB', delay: 100 },
		{ title: 'Parasite', color: '#059669', delay: 200 },
		{ title: 'Dune', color: '#D97706', delay: 300 },
	];

	return (
		<View style={styles.container}>
			<Animated.View entering={FadeIn.duration(500)} style={styles.card}>
				<View style={styles.header}>
					<Text style={styles.title}>Your Watchlist</Text>
					<Clock size={16} color='#A78BFA' />
				</View>

				<View style={styles.list}>
					{watchlistItems.map((item, index) => (
						<Animated.View
							key={index}
							entering={FadeInRight.delay(item.delay).duration(500)}
							style={styles.item}
						>
							<View style={[styles.poster, { backgroundColor: item.color }]}>
								<Film size={20} color='rgba(255, 255, 255, 0.5)' />
							</View>
							<View style={styles.itemContent}>
								<Text style={styles.itemTitle}>{item.title}</Text>
								<Text style={styles.itemSubtitle}>Watch soon</Text>
							</View>
							<CheckCircle size={20} color='#6B7280' />
						</Animated.View>
					))}
				</View>

				<Animated.View entering={FadeIn.delay(500).duration(500)}>
					<TouchableOpacity style={styles.button} activeOpacity={0.8}>
						<Text style={styles.buttonText}>Add Movie</Text>
					</TouchableOpacity>
				</Animated.View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 256,
		height: 256,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 35,
	},
	card: {
		width: 224,
		backgroundColor: '#1F2937',
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: 'rgba(139, 92, 246, 0.3)',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	title: {
		fontSize: 14,
		fontWeight: '600',
		color: '#D1D5DB',
	},
	list: {
		marginBottom: 16,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(55, 65, 81, 0.5)',
		borderRadius: 8,
		padding: 8,
		marginBottom: 8,
	},
	poster: {
		width: 40,
		height: 56,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	itemContent: {
		flex: 1,
	},
	itemTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: '#fff',
		marginBottom: 4,
	},
	itemSubtitle: {
		fontSize: 12,
		color: '#9CA3AF',
	},
	button: {
		backgroundColor: '#8B5CF6',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
});
