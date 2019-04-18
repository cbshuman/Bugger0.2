<template>
		<div class="suggestions" v-if="suggestions.length > 0">
			<div class="suggestion">
				<p v-for="s in suggestions" @click="selectItem(s)" class="dropDown">{{s}}</p>
			</div>
		</div>
</template>

<script>
export default
	{
	name: 'autoCompleteForm',
	props:
		{
		collection: Array,
		targetValue: String,
		},
	data()
		{
		return{
			}
		},
	computed:
		{
		suggestions()
			{
			if(this.targetValue != "")
				{
				return this.filter();
				}
			else
				{
				return([]);
				}
			},
		},
	methods:
		{
		selectItem(item)
			{
			//console.log("Emitting");
			this.$emit('SetValue',item);
			},
		filter()
			{
			//console.log(this.collection);
			if(this.collection)
				{
				if(!this.collection.includes(this.targetValue))
					{
					return this.collection.filter(item => item.toLowerCase().startsWith(this.targetValue.toLowerCase()));
					}
				}
			return([]);
			},
		},
	}
</script>

<style scoped>
.suggestions
	{
	position: relative;
	margin:0px;
	}

.suggestion
	{
	width:15em;
	position: absolute;
	background-color: #fff;
	border-left: 3px solid #082D0F;
	border-right: 3px solid #082D0F;
	border-bottom: 3px solid #082D0F;
	border-radius:5px;
	}

.suggestion p
	{
	margin:0px;
	padding:.25em;
	display: block;
	z-index: 1;
	}

.dropDown:hover
	{
	background-color: #17B890;
	color: #fff;
	}
</style>
