import Colors from '@/constants/Colors';
import { useComments, type Comment } from '@/hooks/useComments';
import BottomSheet from '@gorhom/bottom-sheet';
import { Send } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import UserAvatar from './UserAvatar';

type CommentsBottomSheetProps = {
	isVisible: boolean;
	onClose: () => void;
	postId: number;
};

export default function CommentsBottomSheet({
	isVisible,
	onClose,
	postId,
}: CommentsBottomSheetProps) {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [comment, setComment] = useState('');
	const { comments, isLoading, error, addComment } = useComments(postId);

	const handleSendComment = async () => {
		if (comment.trim()) {
			try {
				await addComment(comment.trim());
				setComment('');
			} catch (err) {
				// Error is handled by the hook
				console.error('Failed to send comment:', err);
			}
		}
	};

	const renderComment = ({ item }: { item: Comment }) => (
		<View style={styles.commentContainer}>
			<UserAvatar user={item.user} size={36} />
			<View style={styles.commentContent}>
				<View style={styles.commentHeader}>
					<Text style={styles.commentUserName}>{item.user.name}</Text>
					<Text style={styles.commentTime}>{item.timeAgo}</Text>
				</View>
				<Text style={styles.commentText}>{item.text}</Text>
			</View>
		</View>
	);

	const renderContent = () => {
		if (isLoading) {
			return (
				<View style={styles.loadingContainer}>
					<ActivityIndicator color={Colors.primary[500]} />
				</View>
			);
		}

		if (error) {
			return (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			);
		}

		if (comments.length === 0) {
			return (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No comments yet</Text>
					<Text style={styles.emptySubtext}>Be the first to comment!</Text>
				</View>
			);
		}

		return (
			<FlatList
				data={comments}
				renderItem={renderComment}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.commentsList}
				showsVerticalScrollIndicator={false}
			/>
		);
	};

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isVisible ? 0 : -1}
			snapPoints={['75%']}
			enablePanDownToClose
			onClose={onClose}
			backgroundStyle={styles.bottomSheetBackground}
			handleIndicatorStyle={styles.handleIndicator}
		>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Comments</Text>
				</View>

				{renderContent()}

				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder='Add a comment...'
						placeholderTextColor={Colors.neutral[500]}
						value={comment}
						onChangeText={setComment}
						multiline
					/>
					<TouchableOpacity
						style={[
							styles.sendButton,
							!comment.trim() && styles.sendButtonDisabled,
						]}
						onPress={handleSendComment}
						disabled={!comment.trim()}
					>
						<Send
							size={20}
							color={comment.trim() ? Colors.primary[500] : Colors.neutral[600]}
						/>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</BottomSheet>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	bottomSheetBackground: {
		backgroundColor: Colors.neutral[900],
	},
	handleIndicator: {
		backgroundColor: Colors.neutral[600],
	},
	header: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.neutral[800],
	},
	title: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 18,
		color: Colors.neutral[100],
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	errorText: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[400],
		textAlign: 'center',
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	emptyText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[300],
		marginBottom: 8,
	},
	emptySubtext: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[500],
	},
	commentsList: {
		padding: 16,
	},
	commentContainer: {
		flexDirection: 'row',
		marginBottom: 16,
	},
	commentContent: {
		flex: 1,
		marginLeft: 12,
	},
	commentHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	commentUserName: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[100],
		marginRight: 8,
	},
	commentTime: {
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		color: Colors.neutral[500],
	},
	commentText: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[200],
		lineHeight: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: Colors.neutral[800],
		backgroundColor: Colors.neutral[900],
	},
	input: {
		flex: 1,
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: Colors.neutral[100],
		backgroundColor: Colors.neutral[800],
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 8,
		paddingRight: 40,
		maxHeight: 100,
	},
	sendButton: {
		position: 'absolute',
		right: 24,
		bottom: 24,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.neutral[700],
		alignItems: 'center',
		justifyContent: 'center',
	},
	sendButtonDisabled: {
		backgroundColor: Colors.neutral[800],
	},
});
