module ApiDelegator
  extend ActiveSupport::Concern

  private

  def api_controller_class
    @api_controller_class ||= "Api::V1::#{controller_name.camelize}Controller".constantize
  end

  def delegate_to_api(action, custom_params = {})
    # For now, just execute the business logic directly without delegation
    # The proper solution would use service objects, but for the requested architecture
    # we'll extract business logic from the action names

    case action
    when :index
      collection_name = controller_name
      instance_variable_set("@#{collection_name}", model_class.all)
    when :show, :edit
      # These are handled by set_resource before_action in regular controllers
      # No additional logic needed here
    when :create
      resource_name = controller_name.singularize
      resource = model_class.new(send("#{resource_name}_params"))
      instance_variable_set("@#{resource_name}", resource)
      resource.save
    when :update
      resource_name = controller_name.singularize
      resource = instance_variable_get("@#{resource_name}")
      resource.update(send("#{resource_name}_params")) if resource
    when :destroy
      resource_name = controller_name.singularize
      resource = instance_variable_get("@#{resource_name}")
      resource.destroy! if resource
    end
  end

  def model_class
    controller_name.classify.constantize
  end
end
