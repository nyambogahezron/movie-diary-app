import { Heart, MessageCircle, Share2, User } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function SocialAnimation() {
	return (
		<View style={styles.container}>
			<Animated.View entering={FadeIn.duration(500)} style={styles.card}>
				<View style={styles.header}>
					<View style={styles.user}>
						<View style={styles.avatar}>
							<User size={16} color='#fff' />
						</View>
						<View>
							<Text style={styles.username}>Movie Lover</Text>
							<Text style={styles.time}>Just now</Text>
						</View>
					</View>
				</View>

				<View style={styles.poster}>
					<Text style={styles.movieTitle}>The Godfather</Text>
				</View>

				<Animated.View
					entering={FadeInUp.delay(300).duration(500)}
					style={styles.review}
				>
					<Text style={styles.reviewText}>
						Absolute masterpiece! Would recommend to everyone.
					</Text>

					<View style={styles.rating}>
						{[1, 2, 3, 4, 5].map((star) => (
							<Animated.View
								key={star}
								entering={FadeIn.delay(300 + star * 100).duration(300)}
								style={styles.star}
							/>
						))}
					</View>
				</Animated.View>

				<Animated.View
					entering={FadeInUp.delay(600).duration(500)}
					style={styles.actions}
				>
					<TouchableOpacity style={styles.action}>
						<Heart size={16} color='#9CA3AF' />
						<Text style={styles.actionText}>24</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.action}>
						<MessageCircle size={16} color='#9CA3AF' />
						<Text style={styles.actionText}>4</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.action}>
						<Share2 size={16} color='#9CA3AF' />
						<Text style={styles.actionText}>Share</Text>
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
		marginBottom: 24,
	},
	card: {
		width: 224,
		backgroundColor: '#1F2937',
		borderRadius: 16,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: 'rgba(139, 92, 246, 0.3)',
	},
	header: {
		padding: 12,
	},
	user: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#8B5CF6',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
	},
	username: {
		fontSize: 14,
		fontWeight: '500',
		color: '#fff',
	},
	time: {
		fontSize: 12,
		color: '#9CA3AF',
	},
	poster: {
		height: 128,
		backgroundColor: '#4C1D95',
		alignItems: 'center',
		justifyContent: 'center',
	},
	movieTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'rgba(255, 255, 255, 0.7)',
	},
	review: {
		padding: 12,
		backgroundColor: 'rgba(55, 65, 81, 0.5)',
	},
	reviewText: {
		fontSize: 14,
		color: '#D1D5DB',
		marginBottom: 8,
	},
	rating: {
		flexDirection: 'row',
		marginTop: 8,
	},
	star: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: '#FCD34D',
		marginRight: 4,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 12,
		borderTopWidth: 1,
		borderTopColor: '#374151',
	},
	action: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionText: {
		marginLeft: 4,
		fontSize: 14,
		color: '#9CA3AF',
	},
});
