<template>
	<div class="container">
		<v-data-table :headers="headers" :items="items" hide-default-header hide-default-footer class="elevation-1">
			<template v-slot:item.title="props">
				<a :href="`https://www.reddit.com/r/${props.item.forum}/comments/${props.item.id}`">{{ props.item.title }}</a>
			</template>
			<template v-slot:item.change="props"> &#8593; {{ props.item.change }} % </template>
		</v-data-table>
	</div>
</template>
<script>
export default {
    props: ["items"],
	data() {
		return {
			headers: [
				{ text: "Title", value: "title" },
				{ text: "Forum", value: "forum" },
				{ text: "Quantity", value: "MAX"},
				{ text: "Change", value: "change", width:"20%" },
			],
		};
	},
};
</script>
<style>
.center {
	margin: auto;
	padding: 10px;
}
</style>
