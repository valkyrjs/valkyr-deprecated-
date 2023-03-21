export function Separator({ text }: { text: string }) {
  return (
    <div class="flex items-center justify-center space-x-2 py-4">
      <span class="h-px w-16 bg-gray-600"></span>
      <span class="font-normal text-gray-600">{text}</span>
      <span class="h-px w-16 bg-gray-600"></span>
    </div>
  );
}
