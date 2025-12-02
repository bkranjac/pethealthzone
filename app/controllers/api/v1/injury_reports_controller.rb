module Api
  module V1
    class InjuryReportsController < BaseController
      before_action :set_injury_report, only: %i[ show update destroy ]

      def index
        @injury_reports = InjuryReport.all
        render json: @injury_reports
      end

      def show
        render json: @injury_report
      end

      def create
        @injury_report = InjuryReport.new(injury_report_params)

        if @injury_report.save
          render json: @injury_report, status: :created
        else
          render json: { errors: @injury_report.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @injury_report.update(injury_report_params)
          render json: @injury_report, status: :ok
        else
          render json: { errors: @injury_report.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @injury_report.destroy!
        head :no_content
      end

      private

      def set_injury_report
        @injury_report = InjuryReport.find(params[:id])
      end

      def injury_report_params
        params.require(:injury_report).permit(:pet_id, :injury_id, :body_part, :description, :date)
      end
    end
  end
end
