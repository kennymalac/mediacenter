<template>
    <div :class="info" v-html="infoMessage">
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            default: ""
        },
        preErrorMessage: {
            type: String,
            default: ""
        },
        errorData: {
            required: false,
            type: Object
        }
    },
    computed: {
        infoMessage() {
            if (this.message.length > 0 || !this.errorData || this.status !== 'error') {
                return this.message
            }
            
            if (this.errorData.error) {
                return `${this.preErrorMessage} for the following reason: ` + this.errorData.error
            }
            else {
                let errorText = "<ul>"
                
                for (let [key, value] of Object.entries(this.errorData)) {
                    if (typeof value === 'object' && value.length === undefined) {
                        for (let [key2, value2] of Object.entries(value)) {
                            errorText += key === 'non_field_errors' ? `<li>${value2}</li>` : `<li><b>${key2}</b>: ${value2}</li>`
                        }
                    }
                    else {
                        errorText += key === 'non_field_errors' ? `<li>${value}</li>` : `<li><b>${key}</b>: ${value}</li>`
                    }
                }
                errorText += "</ul>"
                return `${this.preErrorMessage} for the following reasons: <br> ${errorText}`
            }
        },
        info() {
            return {
                alert: true,
                hidden: (this.infoMessage.length < 1),
                error: (this.status === "error"),
                info: (this.status === "info"),
                success: (this.status === "success")
            }
        }
    }
}
</script>
