import { Button } from "@/components/ui/button";
import { PlusIcon, MailIcon, BarChart3Icon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your email template builder</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MailIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3Icon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent This Month</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-semibold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3Icon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-semibold text-gray-900">23.4%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/create">
                <Button className="w-full justify-start" variant="outline">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Template
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <MailIcon className="w-4 h-4 mr-2" />
                View All Templates
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3Icon className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Templates</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Newsletter Template</p>
                  <p className="text-sm text-gray-600">Last edited 2 hours ago</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Welcome Email</p>
                  <p className="text-sm text-gray-600">Last edited 1 day ago</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Promotional Offer</p>
                  <p className="text-sm text-gray-600">Last edited 3 days ago</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
