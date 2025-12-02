module Api
  module V1
    class BaseController < ApplicationController
      skip_before_action :verify_authenticity_token

      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

      private

      def record_not_found
        render json: { error: 'Record not found' }, status: :not_found
      end

      def record_invalid(exception)
        render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
