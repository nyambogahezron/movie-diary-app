import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	Easing,
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from 'react-native-reanimated';
import { slides } from './onboardingData';
import HistoryAnimation from './steps/HistoryAnimation';
import SocialAnimation from './steps/SocialAnimation';
import TrackAnimation from './steps/TrackAnimation';
import WatchlistAnimation from './steps/WatchlistAnimation';

const { width } = Dimensions.get('window');

interface OnboardingProps {
	onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const circleScale = useSharedValue(1);

	const goToNextSlide = useCallback(() => {
		const buttonWidth = width - 48;
		const buttonHeight = 50;
		const largerDimension = Math.max(buttonWidth, buttonHeight);
		const scaleNeeded = (largerDimension / 40) * 2.5; // Add extra to ensure full coverage

		// Animate the circle expansion
		circleScale.value = withTiming(scaleNeeded, {
			duration: 200,
			easing: Easing.inOut(Easing.ease),
		});

		// Delay the slide transition to show the animation
		setTimeout(() => {
			if (currentSlide === slides.length - 1) {
				onComplete();
			} else {
				setCurrentSlide((prev) => prev + 1);
			}

			circleScale.value = withDelay(
				1000,
				withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
			);
		}, 200);
	}, [currentSlide, onComplete, circleScale, width]);

	const goToPreviousSlide = useCallback(() => {
		if (currentSlide > 0) {
			setCurrentSlide((prev) => prev - 1);
		}
	}, [currentSlide]);

	const animatedCircleStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: circleScale.value }],
			position: 'absolute',
			right: 0,
			top: '50%',
			marginTop: -15,
		};
	});

	const getAnimationComponent = (id: string) => {
		switch (id) {
			case 'track':
				return <TrackAnimation />;
			case 'history':
				return <HistoryAnimation />;
			case 'watchlist':
				return <WatchlistAnimation />;
			case 'social':
				return <SocialAnimation />;
			default:
				return null;
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				{/* previous btn */}
				{currentSlide > 0 && (
					<TouchableOpacity
						style={[styles.skipButton, { left: 24 }]}
						onPress={goToPreviousSlide}
					>
						<ChevronLeft size={20} color='#9CA3AF' />
					</TouchableOpacity>
				)}

				{/* skip btn */}
				<TouchableOpacity style={styles.skipButton} onPress={onComplete}>
					<Text style={styles.skipText}>Skip</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				<Animated.View
					entering={FadeIn.duration(500)}
					exiting={FadeOut.duration(500)}
					style={[styles.slide, { width }]}
				>
					{getAnimationComponent(slides[currentSlide].id)}
					<Animated.Text
						entering={FadeIn.duration(500).delay(200)}
						exiting={FadeOut.duration(500).delay(200)}
						style={styles.title}
					>
						{slides[currentSlide].title}
					</Animated.Text>
					<Animated.Text
						entering={FadeIn.duration(500).delay(300)}
						exiting={FadeOut.duration(500).delay(300)}
						style={styles.description}
					>
						{slides[currentSlide].description}
					</Animated.Text>
				</Animated.View>
			</View>

			<View style={styles.footer}>
				<Animated.View
					style={styles.dots}
					entering={FadeIn.duration(500)}
					exiting={FadeOut.duration(500)}
				>
					{slides.map((_, index) => (
						<Animated.View
							entering={FadeIn.duration(300).delay(index * 100)}
							key={index}
							style={[styles.dot, currentSlide === index && styles.activeDot]}
						/>
					))}
				</Animated.View>

				<TouchableOpacity
					style={styles.button}
					onPress={goToNextSlide}
					activeOpacity={0.8}
				>
					<View style={styles.buttonInnerContainer}>
						<Text style={styles.buttonText}>
							{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
						</Text>

						{currentSlide < slides.length - 1 && (
							<>
								<Animated.View
									style={[styles.buttonCircle, animatedCircleStyle]}
								/>
								<View style={styles.staticButtonCircle}>
									<ArrowRight
										size={20}
										color='#fff'
										style={{
											alignContent: 'center',
											justifyContent: 'center',
											marginRight: 20,
											position: 'absolute',
										}}
									/>
								</View>
							</>
						)}
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111827',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	skipButton: {
		position: 'absolute',
		top: 48,
		right: 24,
		zIndex: 1,
	},
	skipText: {
		color: '#9CA3AF',
		fontSize: 14,
		fontWeight: '500',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 35,
	},
	slide: {
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#fff',
		textAlign: 'center',
		marginBottom: 16,
		marginTop: 28,
	},
	description: {
		fontSize: 16,
		color: '#9CA3AF',
		textAlign: 'center',
		marginBottom: 32,
	},
	footer: {
		padding: 24,
		alignItems: 'center',
		marginBottom: 24,
	},
	dots: {
		flexDirection: 'row',
		marginBottom: 32,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'rgba(156, 163, 175, 0.4)',
		marginHorizontal: 4,
	},
	activeDot: {
		width: 24,
		backgroundColor: '#8B5CF6',
	},
	button: {
		borderWidth: 1,
		borderColor: '#8B5CF6',
		borderRadius: 9999,
		marginBottom: 30,
		width: width - 48,
		paddingVertical: 10,
		overflow: 'hidden',
		position: 'relative',
	},
	buttonInnerContainer: {
		width: '100%',
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 3,
		paddingVertical: 5,
		zIndex: 1,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		zIndex: 2,
	},
	staticButtonCircle: {
		position: 'absolute',
		right: 0,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 3,
	},
	buttonCircle: {
		width: 40,
		marginRight: 10,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#8B5CF6',
		position: 'absolute',
		right: 0,
		zIndex: 1,
	},
});
