import { PlusIcon, MailIcon, Edit3Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Newsletter Template",
      category: "Newsletter",
      lastEdited: "2 hours ago",
      status: "Draft"
    },
    {
      id: 2,
      name: "Welcome Email",
      category: "Welcome",
      lastEdited: "1 day ago",
      status: "Published"
    },
    {
      id: 3,
      name: "Promotional Offer",
      category: "Promotional",
      lastEdited: "3 days ago",
      status: "Draft"
    },
    {
      id: 4,
      name: "Order Confirmation",
      category: "Transactional",
      lastEdited: "1 week ago",
      status: "Published"
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
            <p className="text-gray-600 mt-2">Manage and create your email templates</p>
          </div>
          <Link href="/templates/create">
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create New Template
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Template Card */}
          <Link
            href="/templates/create"
            className="flex flex-col gap-4 p-6 w-full items-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-full w-12 h-12">
              <PlusIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Create New Template</div>
              <div className="text-sm text-gray-500">Start from scratch</div>
            </div>
          </Link>

          {/* Existing Templates */}
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MailIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit3Icon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Category:</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{template.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    template.status === 'Published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {template.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last edited:</span>
                  <span>{template.lastEdited}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
