import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription.service';
import { verifyAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscription = await SubscriptionService.getUserSubscription(user.id);

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
}
